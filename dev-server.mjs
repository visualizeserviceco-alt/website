#!/usr/bin/env node
/**
 * Minimal static dev server - no os.networkInterfaces() (avoids ERR_SYSTEM_ERROR in some environments).
 * Usage: node dev-server.mjs [port]
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || process.argv[2] || '3000', 10);

const MIMES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const REWRITES = {
  '/work': '/pages/Work.html',
  '/about': '/pages/About.html',
  '/contact': '/pages/Contact.html',
  '/quote': '/pages/Quote.html',
  '/portfolio': '/pages/Portfolio.html',
  '/stickers': '/pages/Stickers.html',
  '/order-stickers': '/pages/OrderStickers.html',
  '/process': '/pages/Process.html',
  '/payments': '/pages/Payments.html',
  '/terms': '/pages/Terms.html',
};

function createServer() {
  return http.createServer((req, res) => {
    let url = (req.url || '/').split('?')[0];
    if (REWRITES[url]) url = REWRITES[url];
    if (url === '/') url = '/index.html';
    if (url.startsWith('/')) url = url.slice(1);
    const filePath = path.resolve(__dirname, path.normalize(url));
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }
    const ext = path.extname(filePath);
    const mime = MIMES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          return;
        }
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    });
  });
}

function tryListen(p) {
  if (p > 3010) {
    console.error('No available port between 3000 and 3010.');
    process.exit(1);
  }
  const server = createServer();
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${p} in use, trying ${p + 1}...`);
      tryListen(p + 1);
    } else {
      throw err;
    }
  });
  server.listen(p, '0.0.0.0', () => {
    console.log(`\n  Local:   http://localhost:${p}/\n`);
  });
}
tryListen(PORT);
