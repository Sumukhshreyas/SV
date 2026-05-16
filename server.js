const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd());
const port = Number(process.argv[2] || 5500);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};
http.createServer((req,res)=>{
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rel = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.resolve(root, `.${decodeURIComponent(rel)}`);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data)=>{
    if (err && !path.extname(file)) {
      const fallback = path.join(root, 'index.html');
      return fs.readFile(fallback, (fallbackErr, fallbackData)=>{
        if (fallbackErr) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, {'Content-Type': types['.html']});
        res.end(fallbackData);
      });
    }
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(data);
  });
}).listen(port, '127.0.0.1', ()=>console.log(`SV page running at http://127.0.0.1:${port}/index.html`));
