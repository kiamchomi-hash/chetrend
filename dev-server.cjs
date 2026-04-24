const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

function servePreview(port) {
  http
    .createServer((req, res) => {
      const reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
      const safePath = reqPath === "/" ? "/index.html" : reqPath;
      const filePath =
        safePath === "/favicon.ico" ? path.join(root, "favicon.svg") : path.join(root, safePath);

      fs.readFile(filePath, "utf8", (error, data) => {
        if (error) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Not found");
          return;
        }

        let body = data;
        let contentType = mime[path.extname(filePath)] || "application/octet-stream";

        if (safePath === "/index.html") {
          contentType = "text/html; charset=utf-8";
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(body);
      });
    })
    .listen(port, "127.0.0.1", () => {
      process.stdout.write(`preview listening on http://127.0.0.1:${port}\n`);
    });
}

servePreview(4173);
servePreview(4174);
