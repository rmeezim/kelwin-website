// node work/gen.mjs interior X
// Evaluates site/frag/<sec>/<opt>.js with a stub window, calls KM.geo(), and
// writes each { key: { d?, style? } } into the elements marked data-g="key"
// in site/frag/<sec>/<opt>.html (so the static HTML = the final drawing).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [sec, opt] = process.argv.slice(2);
const dir = path.join(ROOT, "site", "frag", sec);
const js = fs.readFileSync(path.join(dir, `${opt}.js`), "utf8");
const win = {};
new Function("window", js)(win);
const g = win.KM.geo();
const hp = path.join(dir, `${opt}.html`);
let html = fs.readFileSync(hp, "utf8");
let n = 0;
for (const [key, v] of Object.entries(g)) {
  for (const [attr, val] of Object.entries(v)) {
    const re = new RegExp(`(<[^>]*\\bdata-g="${key}"[^>]*?\\s${attr}=")[^"]*(")`);
    const re2 = new RegExp(`(<[^>]*?\\s${attr}=")[^"]*("[^>]*\\bdata-g="${key}")`);
    if (re.test(html)) { html = html.replace(re, `$1${val}$2`); n++; }
    else if (re2.test(html)) { html = html.replace(re2, `$1${val}$2`); n++; }
    else console.log(`  ! no ${attr} slot for data-g="${key}"`);
  }
}
fs.writeFileSync(hp, html);
console.log(`gen ${sec}/${opt}: ${n} attributes written`);
