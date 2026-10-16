"""Round 10: render the proposal documents (markdown) as reading pages in the review's own style.

    from md10 import render_doc, render_deck, parse_tree, plain, slug

  · render_doc(md, title, kicker, lede) -> (html, anchors): a faithful conversion (headings with ids, paragraphs,
    nested lists, tables as tables, quotes, rules); a code block drawn as a sitemap tree becomes the same outline
    the review page uses. anchors maps each heading's text to its id.
  · render_deck(md, ...) -> html: the Narrative Systems copy deck as a page to read. The words that go on the page
    (the deck's quote blocks) are set large; the notes around them are set small and can be hidden; the drawing
    notes fold away; the team's build notes and checklists are left out.
  · parse_tree(code) -> rows of the sitemap outline: {depth, route, name, status, when, group}.
  · plain(s) strips the plan's internal cross-references ("(A7, A8)", "(Q11)") the founder never saw.
"""
import html as H
import re

MARK = re.compile(r"^(\s*)(?:([-*])|(\d+)\.)\s+(.*)$")
STATUS = {"NEW": "new", "REWORK": "rework", "KEEP": "keep", "MERGED": "merged", "LATER": "later", "REMOVED": "removed"}
GROUPS = {"CAPABILITIES": "Capabilities", "THE FIRM": "The Firm", "RESOURCES": "Resources", "LEGAL AND SYSTEM": "Legal and system"}


def plain(s: str) -> str:
    """Remove the plan's codes: a parenthesis holding only codes goes; a code at the end of a longer one goes."""
    if not isinstance(s, str):
        return s
    code = r"[AQ]\d+(?:[–-][AQ]?\d+)?"
    s = re.sub(rf"\s*\((?:{code})(?:,\s*{code})*\)", "", s)
    s = re.sub(rf"(?:,\s*{code})+(?=\))", "", s)
    s = re.sub(rf"\((?:{code}),\s*", "(", s)
    return s


def slug(s: str) -> str:
    s = re.sub(r"[*`]", "", s).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "s"


def inline(s: str) -> str:
    s = H.escape(s, quote=False)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<![\w*])\*(?![\s*])(.+?)(?<![\s*])\*(?![\w*])", r"<em>\1</em>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', s)
    return s


def ind(ln: str) -> int:
    return len(ln) - len(ln.lstrip(" "))


def block_start(ln: str) -> bool:
    s = ln.lstrip()
    return s.startswith(("#", "|", ">", "```")) or s.strip() in ("---", "***") or bool(MARK.match(ln))


# ── the sitemap outline ──
def parse_tree(code: str) -> list:
    rows = []
    for ln in code.splitlines():
        if not ln.strip():
            continue
        m = re.match(r"^([│├└─\s]*)(.*)$", ln)
        prefix, rest = m.group(1), m.group(2).rstrip()
        depth = len(prefix) // 3
        cells = re.split(r"\s{2,}", rest)
        if len(cells) >= 3 and cells[-2] in STATUS:
            route, name = cells[0], " ".join(cells[1:-2])
            rows.append({"depth": depth, "route": route, "name": name, "status": STATUS[cells[-2]], "when": cells[-1], "group": False})
        elif len(cells) >= 4 and cells[-2].split()[0] in STATUS:
            rows.append({"depth": depth, "route": cells[0], "name": " ".join(cells[1:-2]), "status": STATUS[cells[-2].split()[0]], "when": cells[-1], "group": False})
        else:
            name = cells[0]
            rows.append({"depth": depth, "route": "A menu group" if len(cells) > 1 and "menu group" in cells[1] else "", "name": GROUPS.get(name, name.capitalize()),
                         "status": "", "when": "", "group": True})
    return rows


def tree_html(rows: list) -> str:
    out, depth = [], -1
    for r in rows:
        if r["depth"] > depth:
            if depth != -1:
                out.append("<ul>")
        else:
            out.append("</li>")
            for _ in range(depth, r["depth"], -1):
                out.append("</ul></li>")
        depth = r["depth"]
        chip = f'<span class="chip st-{r["status"]}">{r["status"].capitalize()}</span>' if r["status"] else "<span></span>"
        when = f'<span class="t-when">{H.escape(r["when"])}</span>' if r["when"] and r["when"] not in ("launch",) else ""
        out.append(f'<li class="t-node{" t-group" if r["group"] else ""}" data-st="{r["status"]}"><div class="t-row"><span class="t-name">{H.escape(r["name"])}</span>'
                   f'<span class="t-route">{H.escape(r["route"])}</span>{chip}{when or "<span></span>"}</div>')
    if depth >= 0:
        out.append("</li>")
        for _ in range(depth, 0, -1):
            out.append("</ul></li>")
    return f'<ul class="tree">{"".join(out)}</ul>'


# ── blocks ──
def parse_blocks(md: str) -> list:
    lines = md.splitlines()
    blocks, i = [], 0
    while i < len(lines):
        ln = lines[i]
        s = ln.strip()
        if not s:
            i += 1
            continue
        if s.startswith("```"):
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith("```"):
                j += 1
            blocks.append(("code", "\n".join(lines[i + 1:j])))
            i = j + 1
            continue
        m = re.match(r"^(#{1,6})\s+(.*)$", s)
        if m:
            blocks.append(("h", len(m.group(1)), m.group(2).strip()))
            i += 1
            continue
        if s in ("---", "***"):
            blocks.append(("hr",))
            i += 1
            continue
        if s.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
                    rows.append(cells)
                i += 1
            blocks.append(("table", rows))
            continue
        if s.startswith(">"):
            q = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                q.append(re.sub(r"^\s*>\s?", "", lines[i]))
                i += 1
            blocks.append(("quote", q))
            continue
        if MARK.match(ln):
            html, i = parse_list(lines, i, ind(ln))
            blocks.append(("list", html))
            continue
        para = [s]
        i += 1
        while i < len(lines) and lines[i].strip() and not block_start(lines[i]):
            para.append(lines[i].strip())
            i += 1
        blocks.append(("p", " ".join(para)))
    return blocks


def parse_list(lines: list, i: int, base: int):
    m = MARK.match(lines[i])
    ordered = m.group(3) is not None
    start = int(m.group(3)) if ordered else 1
    items = []          # each: [text parts], [sub html]
    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines) and items and (ind(lines[j]) > base or (MARK.match(lines[j]) and ind(lines[j]) == base and bool(MARK.match(lines[j]).group(3)) == ordered)):
                i = j
                continue
            break
        mm = MARK.match(ln)
        k = ind(ln)
        if mm and k == base:
            if bool(mm.group(3)) != ordered:
                break
            items.append([[mm.group(4)], []])
            i += 1
        elif mm and k > base:
            sub, i = parse_list(lines, i, k)
            items[-1][1].append(sub)
        elif mm:
            break
        elif k > base or not block_start(ln):
            if k <= base and not lines[i - 1].strip():
                break
            if items[-1][1]:
                items[-1][1].append(f"<p>{inline(ln.strip())}</p>")
            else:
                items[-1][0].append(ln.strip())
            i += 1
        else:
            break
    tag = "ol" if ordered else "ul"
    attr = f' start="{start}"' if ordered and start != 1 else ""
    body = "".join(f"<li>{inline(' '.join(t))}{''.join(sub)}</li>" for t, sub in items)
    return f"<{tag}{attr}>{body}</{tag}>", i


def table_html(rows: list, cls: str = "") -> str:
    if not rows:
        return ""
    head, body = rows[0], rows[1:]
    th = "".join(f'<th scope="col">{inline(c)}</th>' for c in head)
    tr = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body)
    return f'<div class="tbl-wrap"><table class="tbl {cls}"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>'


def quote_html(q: list) -> str:
    paras, cur = [], []
    for ln in q:
        if not ln.strip():
            if cur:
                paras.append(" ".join(cur))
                cur = []
        else:
            cur.append(ln.strip())
    if cur:
        paras.append(" ".join(cur))
    return "<blockquote>" + "".join(f"<p>{inline(p)}</p>" for p in paras) + "</blockquote>"


# ── the page shell ──
CSS = """
@font-face { font-family: "Mona Sans Local"; font-weight: 200 900; font-stretch: 75% 125%; font-display: swap; src: url(fonts/MonaSans.woff2) format("woff2"); }
@font-face { font-family: "JetBrains Mono Local"; font-weight: 400 700; font-display: swap; src: url(fonts/JetBrainsMono.woff2) format("woff2"); }
:root { --bg: #141517; --panel: #1C1D20; --well: #0E0F11; --fg: #FBFAF6; --fg-2: #C6C7CA; --fg-3: #9A9DA3; --line: rgba(251,250,246,0.14); --line-2: rgba(251,250,246,0.3);
  --red: #BF3A36; --signal: #E8564E; --blush: #F2C9BF;
  --f: "Mona Sans", "Mona Sans Local", "Helvetica Neue", Arial, sans-serif; --mono: "JetBrains Mono", "JetBrains Mono Local", ui-monospace, Menlo, monospace;
  --gut: clamp(16px, 3.4vw, 48px); color-scheme: dark; }
* { box-sizing: border-box; }
html { scroll-padding-top: 80px; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 400 16.5px/1.6 var(--f); -webkit-font-smoothing: antialiased; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 60; background: var(--bg); }
a { color: var(--fg); text-decoration-color: var(--line-2); text-underline-offset: 3px; }
a:hover { text-decoration-color: var(--fg); }
:focus-visible { outline: 2px solid var(--blush); outline-offset: 3px; }
i, em { font-style: normal; font-weight: 600; color: var(--fg); }
b, strong { font-weight: 600; color: var(--fg); }
code { font: inherit; padding: 0 4px; background: var(--panel); color: var(--fg); }
h1, h2, h3, h4 { text-wrap: balance; }
p, li, td, th { overflow-wrap: break-word; }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 50; display: flex; align-items: center; gap: 8px 18px; flex-wrap: wrap;
  padding-block: 12px; padding-left: max(var(--gut), env(safe-area-inset-left, 0px)); padding-right: max(var(--gut), env(safe-area-inset-right, 0px));
  background: var(--bg); border-bottom: 1px solid var(--line); }
.logo { display: inline-block; height: 16px; aspect-ratio: 734 / 152; background: var(--fg); -webkit-mask: url(brand/kelwin-lockup.svg) left center / contain no-repeat; mask: url(brand/kelwin-lockup.svg) left center / contain no-repeat; }
.bar span.t { font-size: 14px; font-weight: 500; color: var(--fg-2); }
.bar .tools { margin-left: auto; display: flex; gap: 10px; }
.btn { display: inline-flex; align-items: center; min-height: 40px; padding: 8px 14px; border: 1px solid var(--line-2); background: transparent; color: var(--fg); font: 500 14px/1.2 var(--f); cursor: pointer; text-decoration: none; }
.btn:hover { border-color: var(--fg); }
.btn[aria-pressed="true"] { background: var(--fg); color: var(--bg); }
.doc { padding-left: max(var(--gut), env(safe-area-inset-left, 0px)); padding-right: max(var(--gut), env(safe-area-inset-right, 0px)); padding-block: 56px 120px; }
.in { max-width: 1040px; margin: 0 auto; }
.in > p, .in > ul, .in > ol, .in > blockquote, .in > h3, .in > h4, .in .tx { max-width: 74ch; }
.kicker { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 14px; font-weight: 500; color: var(--fg-2); }
.kicker::before { content: ""; width: 8px; height: 8px; background: var(--signal); }
h1 { margin: 18px 0 0; font-stretch: 110%; font-weight: 430; font-size: clamp(36px, 5vw, 64px); line-height: 1.02; letter-spacing: -0.018em; }
.rule { display: block; width: 48px; height: 2px; background: var(--red); margin: 26px 0 0; }
.lede { margin: 20px 0 0; font-size: 18px; color: var(--fg-2); max-width: 66ch; }
.current { margin: 28px 0 0; max-width: 74ch; padding: 14px 18px; border: 1px dashed var(--line-2); display: flex; gap: 12px; align-items: baseline; font-size: 15.5px; color: var(--fg); }
.current::before { content: ""; width: 8px; height: 8px; flex: none; background: var(--signal); transform: translateY(-1px); }
.toc { margin: 36px 0 0; padding: 18px 20px; border: 1px solid var(--line); background: var(--panel); }
.toc b { display: block; font-size: 14px; font-weight: 500; color: var(--fg-2); margin-bottom: 8px; }
.toc ol { margin: 0; padding-left: 22px; columns: 2 280px; column-gap: 40px; font-size: 15px; }
.toc li { padding: 3px 0; break-inside: avoid; }
.toc ol.bare { list-style: none; padding-left: 0; }
.toc li::marker { color: var(--fg-3); font-family: var(--mono); font-size: 13.5px; }
h2 { margin: 72px 0 0; padding-top: 22px; border-top: 1px solid var(--line-2); font-stretch: 110%; font-weight: 430; font-size: clamp(26px, 2.8vw, 36px); line-height: 1.12; letter-spacing: -0.012em; }
h3 { margin: 40px 0 0; font-stretch: 110%; font-weight: 430; font-size: 22px; line-height: 1.25; }
h4 { margin: 32px 0 0; font-size: 18px; font-weight: 500; line-height: 1.3; }
h5, h6 { margin: 24px 0 0; font-size: 16px; font-weight: 500; }
p { margin: 12px 0 0; color: var(--fg-2); }
ul, ol { margin: 12px 0 0; padding-left: 22px; color: var(--fg-2); }
li { margin: 5px 0; }
li > ul, li > ol { margin-top: 4px; }
li::marker { color: var(--fg-3); }
hr { margin: 40px 0 0; border: 0; border-top: 1px solid var(--line); }
blockquote { margin: 16px 0 0; padding: 4px 0 4px 18px; border-left: 2px solid var(--line-2); }
blockquote p { color: var(--fg); }
pre { margin: 16px 0 0; padding: 16px; overflow-x: auto; background: var(--well); border: 1px solid var(--line); font: 400 14px/1.5 var(--f); white-space: pre-wrap; }
.tbl-wrap { margin-top: 16px; overflow-x: auto; }
.tbl { width: 100%; border-collapse: collapse; font-size: 15px; }
.tbl th { text-align: left; font-weight: 500; font-size: 14px; color: var(--fg-3); padding: 10px 16px 10px 0; border-bottom: 1px solid var(--line-2); vertical-align: bottom; }
.tbl td { padding: 11px 16px 11px 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--fg-2); min-width: 120px; }
.tbl td:first-child { color: var(--fg); }
/* the sitemap outline */
.chip { display: inline-flex; align-items: center; min-height: 24px; padding: 1px 8px; border: 1px solid var(--line-2); font-size: 14px; font-weight: 500; line-height: 1.35; color: var(--fg-2); white-space: nowrap; }
.chip.st-new { background: var(--fg); border-color: var(--fg); color: var(--bg); } .chip.st-rework { border-color: var(--fg); color: var(--fg); }
.chip.st-later { border-style: dashed; } .chip.st-merged, .chip.st-removed { border-color: var(--line); color: var(--fg-3); }
.tree, .tree ul { margin: 0; padding: 0; list-style: none; color: var(--fg); }
.tree { margin-top: 20px; border-top: 1px solid var(--line-2); }
.tree li { margin: 0; }
.tree ul { margin-left: 10px; padding-left: 22px; border-left: 1px solid var(--line); }
.tree ul > li { position: relative; }
.tree ul > li::before { content: ""; position: absolute; left: -22px; top: 22px; width: 14px; border-top: 1px solid var(--line); }
.t-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr) 96px 90px; gap: 2px 16px; align-items: center; min-height: 44px; padding: 8px 0; border-bottom: 1px solid var(--line); }
.t-name { font-weight: 500; font-size: 15.5px; } .t-route { font-size: 14px; color: var(--fg-3); overflow-wrap: anywhere; } .t-when { font-size: 14px; color: var(--fg-3); }
.t-group > .t-row .t-name { font-size: 14px; color: var(--fg-2); }
.t-node[data-st="removed"] > .t-row .t-name { text-decoration: line-through; color: var(--fg-2); }
/* the copy deck */
.deck-tools { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; font-size: 15px; color: var(--fg-2); }
.pw { margin: 10px 0 0; max-width: 64ch; color: var(--fg); }
.pw p { margin: 8px 0 0; color: var(--fg); font-size: 18px; line-height: 1.5; }
.pw.pw-h1 p { font-stretch: 110%; font-weight: 430; font-size: clamp(36px, 4.6vw, 60px); line-height: 1.02; letter-spacing: -0.018em; }
.pw.pw-h1 p span { display: block; font-weight: 300; color: var(--fg-2); }
.pw.pw-h2 p { font-stretch: 110%; font-weight: 430; font-size: clamp(24px, 2.6vw, 32px); line-height: 1.18; letter-spacing: -0.01em; }
.pw.pw-h3 p { font-stretch: 110%; font-weight: 430; font-size: 22px; }
.pw.pw-label p { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: var(--fg-2); }
.pw.pw-label p::before { content: ""; width: 8px; height: 8px; background: var(--signal); }
.fl { margin: 26px 0 0; font-size: 14px; font-weight: 500; color: var(--fg-3); }
.fl b { color: var(--fg-3); font-weight: 500; }
.nt { font-size: 15px; color: var(--fg-3); }
.nt p, p.nt, .nt li { color: var(--fg-3); font-size: 15px; }
.nt b { color: var(--fg-2); }
.nt em { font-weight: 400; color: inherit; }
.only-page .nt, .only-page details.fold { display: none; }
.deck-sec { margin-top: 64px; padding-top: 22px; border-top: 1px solid var(--line-2); }
details.fold { margin-top: 20px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); max-width: 80ch; }
details.fold > summary { cursor: pointer; padding: 12px 0; font-size: 15px; font-weight: 500; color: var(--fg); }
details.fold > :not(summary) { margin-bottom: 14px; }
details.fold h3 { display: none; }
.tbl.pw-t td { color: var(--fg); }
@media (max-width: 719px) {
  .t-row { grid-template-columns: minmax(0, 1fr) auto; } .t-route { grid-column: 1 / -1; grid-row: 2; } .t-when { grid-column: 2; justify-self: end; }
  .tree ul { margin-left: 4px; padding-left: 14px; } .tree ul > li::before { left: -14px; width: 9px; }
  .tbl { font-size: 14.5px; }
}
"""
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,300..700&family=JetBrains+Mono:wght@400;500&display=swap">')


def shell(title: str, body: str, tools: str = "") -> str:
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            f'<title>{H.escape(title)} · Kelwin round 10</title>{FONTS}<style>{CSS}</style></head><body>'
            f'<header class="bar"><span class="logo" role="img" aria-label="Kelwin"></span><span class="t">Round 10 · {H.escape(title)}</span><span class="tools">{tools}</span></header>'
            f'<main class="doc"><div class="in">{body}</div></main></body></html>')


CURRENT = "Answer on the review page; where this page and the review differ, the review is current."


def head_block(kicker: str, title: str, lede: str) -> str:
    return (f'<p class="kicker">{H.escape(kicker)}</p><h1>{H.escape(title)}</h1><span class="rule" aria-hidden="true"></span>'
            + (f'<p class="lede">{inline(lede)}</p>' if lede else "")
            + f'<p class="current" role="note">{H.escape(CURRENT)}</p>')


def render_doc(md: str, title: str, kicker: str, lede: str = "", clean=None, skip_h1: bool = True):
    """The whole document; its own first heading is replaced by the page head."""
    clean = clean or (lambda s: s)
    blocks = parse_blocks(clean(md))
    anchors, used, out, toc = {}, set(), [], []
    for b in blocks:
        if b[0] == "h":
            lvl, txt = b[1], b[2]
            if lvl == 1 and skip_h1:
                continue
            a = slug(txt)
            k = 2
            while a in used:
                a = f"{slug(txt)}-{k}"
                k += 1
            used.add(a)
            anchors[re.sub(r"[*`]", "", txt)] = a
            if lvl == 2:
                toc.append((a, txt))
            out.append(f'<h{lvl} id="{a}">{inline(txt)}</h{lvl}>')
        elif b[0] == "p":
            out.append(f"<p>{inline(b[1])}</p>")
        elif b[0] == "list":
            out.append(b[1])
        elif b[0] == "table":
            out.append(table_html(b[1]))
        elif b[0] == "quote":
            out.append(quote_html(b[1]))
        elif b[0] == "code":
            out.append(tree_html(parse_tree(b[1])) if "├─" in b[1] else f"<pre>{H.escape(b[1])}</pre>")
        elif b[0] == "hr":
            out.append("<hr>")
    numbered = all(re.match(r"^\d", t) for _, t in toc)
    tocs = (f'<nav class="toc" aria-label="Contents"><b>Contents</b><ol{" class=bare" if numbered else ""}>' + "".join(f'<li><a href="#{a}">{inline(t)}</a></li>' for a, t in toc) + "</ol></nav>") if len(toc) > 3 else ""
    return shell(title, head_block(kicker, title, lede) + tocs + "".join(out)), anchors


# ── the copy deck ──
ROLE = [("headline", "pw-h1"), ("closing line", "pw-h2"), ("heading", "pw-h2"), ("small heading", "pw-h3"), ("label", "pw-label")]


def deck_quote(q: list, role: str) -> str:
    if role == "pw-h1":
        ls = [l.strip() for l in q if l.strip()]
        first, rest = (ls[0], " ".join(ls[1:])) if len(ls) > 1 else (" ".join(ls), "")
        return f'<div class="pw pw-h1"><p>{inline(first)}{f"<span>{inline(rest)}</span>" if rest else ""}</p></div>'
    paras, cur = [], []
    for ln in q:
        s = ln.strip()
        if not s:
            if cur:
                paras.append(cur)
                cur = []
            continue
        if cur and s.startswith("**"):
            cur.append("<br>")
        cur.append(s)
    if cur:
        paras.append(cur)
    ps = []
    for p in paras:
        txt = " ".join(p).replace(" <br> ", "\u0000")
        ps.append(inline(txt).replace("\u0000", "<br>"))
    return f'<div class="pw {role}">' + "".join(f"<p>{x}</p>" for x in ps) + "</div>"


def render_deck(md: str, title: str, kicker: str, lede: str, keep: list, fold_h3=("The drawing", "The artifact"), folded_h2=()):
    """keep: the h2 titles (prefix match) to include, in document order. folded_h2: kept sections shown folded."""
    blocks = parse_blocks(md)
    out, role, in_keep, fold_open, sec_fold = [], "pw-p", False, False, False
    intro = []
    seen_h2 = False
    for b in blocks:
        if b[0] == "h" and b[1] == 1:
            continue
        if not seen_h2 and not (b[0] == "h" and b[1] == 2):
            if b[0] == "p" and b[1].startswith("**How to read it.**"):
                intro.append(f'<p class="nt">{inline(b[1])}</p>')
            continue
        if b[0] == "h" and b[1] == 2:
            seen_h2 = True
            if fold_open:
                out.append("</details>")
                fold_open = False
            if sec_fold:
                out.append("</details>")
                sec_fold = False
            in_keep = any(b[2].startswith(k) for k in keep)
            if in_keep:
                out.append(f'<section class="deck-sec"><h2 id="{slug(b[2])}" style="margin:0;padding:0;border:0">{inline(b[2])}</h2></section>')
                if any(b[2].startswith(k) for k in folded_h2):
                    out.append(f'<details class="fold nt-fold"><summary>Show this part</summary>')
                    sec_fold = True
            continue
        if not in_keep:
            continue
        if b[0] == "h" and b[1] == 3:
            if fold_open:
                out.append("</details>")
                fold_open = False
            if b[2].startswith(fold_h3):
                out.append(f'<details class="fold"><summary>{inline(b[2])}</summary>')
                fold_open = True
            else:
                out.append(f'<h3 class="nt">{inline(b[2])}</h3>')
            continue
        if b[0] == "p":
            txt = b[1]
            m = re.match(r"^\*\*([^*]+)\*\*(\s*\(.*\))?\s*$", txt)
            if m:   # a field label for the words that follow
                lab = m.group(1).strip()
                role = next((r for k, r in ROLE if lab.lower().startswith(k)), "pw-p")
                out.append(f'<p class="fl">{inline(lab)}{f"<span class=nt> {inline(m.group(2).strip())}</span>" if m.group(2) else ""}</p>')
            else:
                out.append(f'<p class="nt">{inline(txt)}</p>')
            continue
        if b[0] == "quote":
            out.append(deck_quote(b[1], role))
            continue
        if b[0] == "table":
            out.append(table_html(b[1], "pw-t" if role != "pw-p" or "Who" in b[1][0][0] else ""))
            continue
        if b[0] == "list":
            out.append(f'<div class="nt">{b[1]}</div>')
            continue
        if b[0] == "code":
            out.append(f'<pre class="nt">{H.escape(b[1])}</pre>')
    if fold_open:
        out.append("</details>")
    if sec_fold:
        out.append("</details>")
    tools = '<button class="btn" type="button" id="only" aria-pressed="false">Only the page\'s words</button>'
    script = ('<script>(function(){var b=document.getElementById("only");b.addEventListener("click",function(){var on=b.getAttribute("aria-pressed")!=="true";'
              'b.setAttribute("aria-pressed",String(on));document.body.classList.toggle("only-page",on);});})();</script>')
    body = (head_block(kicker, title, lede) + "".join(intro)
            + '<p class="deck-tools">Large type is what goes on the page. Small gray type is a note for you. '
              "Press “Only the page's words” in the bar to hide the notes.</p>" + "".join(out))
    return shell(title, body, tools).replace("</body>", script + "</body>")
