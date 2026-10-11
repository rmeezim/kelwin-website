/* letter · S — the reveal, and nothing else.
   The letter is still. Its only motion is reading order: each paragraph rises line by line from its
   own mask, the margin cascades in beside paragraph 1, and the signature dash draws last.
   To rise "line by line", the paragraphs are split into their real rendered lines (measured, not
   guessed), animated, and then restored to plain text once the entrance has landed, so the
   resting page holds ordinary paragraphs that reflow freely. Under reduced motion nothing is split
   and nothing is timed: the markup is already the final state.                                     */
(function () {
  var LINE_START = 360;   // ms: first line, just after the subject begins its rise
  var LINE_STEP = 70;     // ms between lines, in reading order
  var PARA_GAP = 140;     // ms extra breath at each paragraph break
  var RISE = 800;         // ms per line (kit ac-rise)

  function splitLines(p) {
    var text = p.textContent.replace(/[ \t\r\n]+/g, " ").trim();   // ordinary spaces only: no-break spaces stay bound
    var words = text.split(" ");
    p.textContent = "";
    var spans = [];
    for (var i = 0; i < words.length; i++) {
      var s = document.createElement("span");
      s.textContent = words[i];
      p.appendChild(s);
      if (i < words.length - 1) p.appendChild(document.createTextNode(" "));
      spans.push(s);
    }
    var lines = [], cur = [], top = null;
    for (var k = 0; k < spans.length; k++) {
      var t = spans[k].offsetTop;
      if (top === null || Math.abs(t - top) < 4) { if (top === null) top = t; cur.push(words[k]); }
      else { lines.push(cur.join(" ")); cur = [words[k]]; top = t; }
    }
    if (cur.length) lines.push(cur.join(" "));
    p.textContent = "";
    var inners = [];
    for (var j = 0; j < lines.length; j++) {
      var o = document.createElement("span");
      o.className = "km-letter-S__ln";
      var n = document.createElement("span");
      n.textContent = lines[j] + (j < lines.length - 1 ? " " : "");
      o.appendChild(n);
      p.appendChild(o);
      inners.push(n);
    }
    return { text: text, inners: inners };
  }

  window.KM = {
    init: function (root, opts) {
      if (!root || (opts && opts.reduced)) return;            // final state, synchronously
      var paras = Array.prototype.slice.call(root.querySelectorAll(".km-letter-S__p"));
      paras.sort(function (a, b) {                             // reading order, whatever the DOM order
        var o = function (el) { return el.classList.contains("km-letter-S__p--1") ? 1 : el.classList.contains("km-letter-S__p--2") ? 2 : 3; };
        return o(a) - o(b);
      });
      var saved = [], d = LINE_START, last = LINE_START, p1Last = LINE_START;
      paras.forEach(function (p, pi) {
        p.classList.add("is-lined");                           // cancels the whole-paragraph fallback
        var r = splitLines(p);
        saved.push([p, r.text]);
        if (pi > 0) d += PARA_GAP;
        r.inners.forEach(function (n) { n.style.setProperty("--d", d + "ms"); last = d; d += LINE_STEP; });
        if (pi === 0) p1Last = last;
      });
      // the late beats follow the real line count
      var bodyEnd = last + RISE;
      var sig = last + 260, ps = sig + 260, dash = Math.max(bodyEnd + 220, ps + 160 + 2 * 80 + 300);
      root.style.setProperty("--lt-m", (p1Last + 240) + "ms");     // the movie first, then it is itemised
      root.style.setProperty("--lt-sig", sig + "ms");
      root.style.setProperty("--lt-ps", ps + "ms");
      root.style.setProperty("--lt-dash", dash + "ms");

      var done = false;
      function restore() {
        if (done) return; done = true;
        saved.forEach(function (s) { s[0].textContent = s[1]; });
        window.removeEventListener("resize", onResize);
      }
      var w0 = window.innerWidth;
      function onResize() { if (window.innerWidth !== w0) restore(); }
      window.addEventListener("resize", onResize);
      setTimeout(restore, bodyEnd + 120);
    }
  };
})();
