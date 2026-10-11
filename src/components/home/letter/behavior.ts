import type { Behavior } from "../types";

/* letter · the reveal, and nothing else (ported from design/redesign/site/frag/letter/S.js).
   The letter is still. Its only motion is reading order: each paragraph rises line by line from its
   own mask, the margin cascades in beside paragraph 1 (after paragraph 2 where it drops into the
   flow, ≤1023px), and the signature dash draws last.
   To rise "line by line", the paragraphs are split into their real rendered lines (measured, not
   guessed), animated, and then restored once the entrance has landed, so the resting page holds
   ordinary paragraphs that reflow freely (and React's own text nodes are put back). Under reduced
   motion nothing is split and nothing is timed: the markup is already the final state.
   Cost: the split runs inside the scroll that brings the letter in, so it reads everything first and
   writes after — the lines are measured on the untouched text with Ranges (no DOM writes, one
   layout), then every paragraph is rebuilt in one pass (one restyle). */

const LINE_START = 360; // ms: first line, just after the subject begins its rise
const LINE_STEP = 70; // ms between lines, in reading order
const PARA_GAP = 140; // ms extra breath at each paragraph break
const RISE = 800; // ms per line (kit ac-rise)
const M_LEAD = 240; // ms: the margin label follows the last line of the paragraph it sits beside
const M_ROWS = 160; // ms: label → first symptom row (letter.css: --lt-m + 160ms)
const M_STEP = 80; // ms between symptom rows (letter.css: --i * 80ms)
const LATE = ["--lt-m", "--lt-sig", "--lt-ps", "--lt-dash"] as const;

const BREAK = /[ \t\r\n]/; // ordinary spaces only: no-break spaces stay bound, so a dash never starts a line

/** A paragraph's rendered lines, read from its text as it stands (no DOM writes): one Range per
 *  word, and a word opens a new line when its first box sits lower than the line's. */
function readLines(p: HTMLElement, range: Range): string[] {
  const lines: string[] = [];
  let line: string[] = [];
  let top: number | null = null;
  let word = "";
  let from: [Text, number] | null = null; // where the word in progress starts (it may run across text nodes)
  let to: [Text, number] | null = null;
  const close = () => {
    if (!word || !from || !to) return;
    range.setStart(from[0], from[1]);
    range.setEnd(to[0], to[1]);
    const t = (range.getClientRects()[0] ?? range.getBoundingClientRect()).top;
    if (top === null || Math.abs(t - top) < 4) {
      if (top === null) top = t;
      line.push(word);
    } else {
      lines.push(line.join(" "));
      line = [word];
      top = t;
    }
    word = "";
    from = to = null;
  };
  const walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode() as Text | null; n; n = walk.nextNode() as Text | null) {
    const text = n.data;
    for (let i = 0; i < text.length; i++) {
      if (BREAK.test(text[i])) {
        close();
        continue;
      }
      if (!word) from = [n, i];
      word += text[i];
      to = [n, i + 1];
    }
  }
  close();
  if (line.length) lines.push(line.join(" "));
  return lines;
}

/** One masked span per line; returns the outer masks and their inner (rising) spans. */
function buildLines(lines: string[]) {
  const outers: HTMLSpanElement[] = [];
  const inners: HTMLSpanElement[] = [];
  lines.forEach((line, j) => {
    const o = document.createElement("span");
    o.className = "km-letter__ln";
    const n = document.createElement("span");
    n.textContent = line + (j < lines.length - 1 ? " " : "");
    o.appendChild(n);
    outers.push(o);
    inners.push(n);
  });
  return { outers, inners };
}

const order = (el: Element) =>
  el.classList.contains("km-letter__p--1") ? 1 : el.classList.contains("km-letter__p--2") ? 2 : 3;

export const init: Behavior = (root, { reduced }) => {
  if (reduced) return; // final state, synchronously

  // reading order, whatever the DOM order
  const paras = Array.from(root.querySelectorAll<HTMLElement>(".km-letter__p")).sort((a, b) => order(a) - order(b));
  // Beside the letter (≥1024) the margin follows paragraph 1, the movie it itemises. Below that it
  // sits in the flow after paragraph 2 (letter.css), so it is read there: it cascades after P2's last
  // line and P3 waits for its last row. Measured from the layout (offsetTop ignores the running
  // fallback transform), not from a breakpoint.
  const margin = root.querySelector<HTMLElement>(".km-letter__margin");
  const p2 = paras[1];
  const stacked = !!margin && !!p2 && margin.offsetTop >= p2.offsetTop + p2.offsetHeight;
  const rows = margin ? margin.querySelectorAll(".km-letter__sym > li").length : 0;

  // read: every paragraph's lines, before anything is written
  const range = document.createRange();
  const measured = paras.map((p) => readLines(p, range));

  // write: rebuild every paragraph as its lines, in one pass
  const saved: { p: HTMLElement; nodes: ChildNode[] }[] = [];
  let d = LINE_START;
  let last = LINE_START;
  let lm = LINE_START + M_LEAD;
  paras.forEach((p, pi) => {
    saved.push({ p, nodes: Array.from(p.childNodes) });
    const { outers, inners } = buildLines(measured[pi]);
    if (pi > 0) d += PARA_GAP;
    if (stacked && pi === 2) {
      lm = last + M_LEAD; // the margin, read between P2 and P3
      d = lm + M_ROWS + Math.max(rows - 1, 0) * M_STEP + LINE_STEP + PARA_GAP; // then P3, a paragraph's breath after the last row
    }
    inners.forEach((n) => {
      n.style.setProperty("--d", `${d}ms`);
      last = d;
      d += LINE_STEP;
    });
    if (!stacked && pi === 0) lm = last + M_LEAD; // the movie first, then it is itemised
    p.classList.add("is-lined"); // cancels the whole-paragraph fallback
    p.replaceChildren(...outers);
  });

  // the late beats follow the real line count
  const bodyEnd = last + RISE;
  const sig = last + 260;
  const ps = sig + 260;
  const dash = Math.max(bodyEnd + 220, ps + 160 + 2 * 80 + 300);
  root.style.setProperty("--lt-m", `${lm}ms`);
  root.style.setProperty("--lt-sig", `${sig}ms`);
  root.style.setProperty("--lt-ps", `${ps}ms`);
  root.style.setProperty("--lt-dash", `${dash}ms`);

  let done = false;
  let timer = 0;
  const w0 = window.innerWidth;
  const restore = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener("resize", onResize);
    // put the paragraphs' original text nodes back (the ones React rendered)
    saved.forEach(({ p, nodes }) => p.replaceChildren(...nodes));
  };
  // a width change mid-entrance would leave the measured lines wrong: land the plain text at once
  const onResize = () => {
    if (window.innerWidth !== w0) restore();
  };
  window.addEventListener("resize", onResize);
  timer = window.setTimeout(restore, bodyEnd + 120);

  return () => {
    restore();
    // back to the pre-init state: the whole-paragraph fallback and the default late beats
    paras.forEach((p) => p.classList.remove("is-lined"));
    LATE.forEach((k) => root.style.removeProperty(k));
  };
};
