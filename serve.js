/**
 * Static file server for communist-youth-site
 * Usage: node serve.js [port]
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2] || '3456', 10);
const ROOT = __dirname;

const MIME = {
  html : 'text/html; charset=utf-8',
  css  : 'text/css; charset=utf-8',
  js   : 'application/javascript; charset=utf-8',
  json : 'application/json',
  png  : 'image/png',
  jpg  : 'image/jpeg',
  jpeg : 'image/jpeg',
  svg  : 'image/svg+xml',
  ico  : 'image/x-icon',
  woff2: 'font/woff2',
  woff : 'font/woff',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext      = path.extname(filePath).slice(1).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + urlPath);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n  ✅ Static server running at http://localhost:${PORT}\n`);
});
