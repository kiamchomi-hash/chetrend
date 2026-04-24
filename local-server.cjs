const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  let url = (req.url || "/").split("?")[0];
  if (url === "/") {
    url = "/index.html";
  }

  const file = path.join(root, url);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }

    res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
    res.end(data);
  });
});

server.listen(4173, "127.0.0.1", () => {
  console.log("listening on http://127.0.0.1:4173");
});
