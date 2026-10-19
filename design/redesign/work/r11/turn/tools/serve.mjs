// A static server for the turn test pages: <root> first, then R/site; clean routes redirect to the page files.
// Options on the returned object: delay(route → ms) to hold a page back (a slow page), /204 answers 204,
// cache: a Cache-Control value for the pages (default no-store; "max-age=600" is what GitHub Pages sends: a real network).
// hits: every page request, with its Sec-Purpose ("prefetch" for the turn's prefetch hint).
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
export const R = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign";
export const SITE = path.join(R, "site");
export const L = path.join(R, "qa/r11/look/turn");
export const FF = path.resolve(R, "..", "ffenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2");
const ROUTES = { "/": "page-home.html", "/audit": "page-audit.html", "/insights": "page-insights.html", "/contact": "page-contact.html" };
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };
export async function serve(root) {
  const S = { delay: {}, hits: [], cache: "" };
  const server = http.createServer((q, s) => {
    const u = decodeURIComponent(q.url.split("?")[0].split("#")[0]);
    const route = u.replace(/\/$/, "") || "/";
    if (route === "/204") { s.writeHead(204); s.end(); return; }
    if (ROUTES[route] && !u.endsWith(".html")) { s.writeHead(302, { location: "/" + ROUTES[route] }); s.end(); return; }
    let f = path.join(root, u);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(SITE, u);
    const send = () => fs.readFile(f, (e, d) => {
      if (e) { s.writeHead(404); s.end(); return; }
      s.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream", "cache-control": (u.endsWith(".html") && S.cache) || "no-store" }); s.end(d);
    });
    if (u.endsWith(".html")) S.hits.push({ u, t: Date.now(), purpose: q.headers["sec-purpose"] || q.headers["purpose"] || "" });
    const ms = S.delay[path.basename(u)] || 0;
    if (ms) setTimeout(send, ms); else send();
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  S.base = `http://127.0.0.1:${server.address().port}/`;
  S.close = () => server.close();
  return S;
}
