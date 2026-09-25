// Serves the static export (out/) with the SAME Content-Security-Policy
// that public/.htaccess sends on Hostinger, so a CSP change can be
// tested locally before upload:
//   npm run build && node scripts/csp-test-server.mjs   → http://localhost:3006
// Then click through the site with DevTools open and look for
// "Refused to …" console errors.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve("out");
const PORT = Number(process.env.PORT || 3006);
const htaccess = fs.readFileSync("public/.htaccess", "utf8");
const csp = /Content-Security-Policy "([^"]+)"/.exec(htaccess)?.[1];
if (!csp) throw new Error("No Content-Security-Policy found in public/.htaccess");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css",
  ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml",
  ".webmanifest": "application/manifest+json", ".mp4": "video/mp4", ".webm": "video/webm",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) file = path.join(ROOT, "404.html");
    const type = TYPES[path.extname(file)] || "application/octet-stream";
    // gzip text like Hostinger/LiteSpeed does, so size tests are realistic
    const gz = /text|javascript|json|xml|svg|manifest/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "");
    res.writeHead(fs.existsSync(file) && file.endsWith("404.html") && !p.includes("404") ? 404 : 200, {
      "Content-Type": type,
      "Content-Security-Policy": csp,
      ...(gz ? { "Content-Encoding": "gzip" } : {}),
    });
    const stream = fs.createReadStream(file);
    (gz ? stream.pipe(zlib.createGzip()) : stream).pipe(res);
  })
  .listen(PORT, () => console.log(`CSP test server on http://localhost:${PORT}\nCSP: ${csp}`));
