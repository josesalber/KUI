const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');
const portArg = process.argv[2];
const port = Number(portArg) || 5173;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function safeJoin(baseDir, requestPath) {
  const normalized = path.normalize(requestPath).replace(/^([\/\\])+/, '');
  const resolved = path.resolve(baseDir, normalized);
  if (!resolved.startsWith(baseDir)) {
    return null;
  }
  return resolved;
}

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || 'application/octet-stream';
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.statusCode = 500;
      response.end('Internal Server Error');
      return;
    }
    response.statusCode = 200;
    response.setHeader('Content-Type', contentType);
    response.end(data);
  });
}

function tryServe(requestPath, response) {
  const candidates = [];

  if (requestPath === '/' || requestPath === '') {
    candidates.push(path.join(rootDir, 'index.html'));
  } else {
    const rootCandidate = safeJoin(rootDir, requestPath);
    if (rootCandidate) {
      candidates.push(rootCandidate);
    }

    const publicCandidate = safeJoin(publicDir, requestPath);
    if (publicCandidate) {
      candidates.push(publicCandidate);
    }
  }

  for (const candidate of candidates) {
    try {
      const stats = fs.statSync(candidate);
      if (stats.isFile()) {
        sendFile(response, candidate);
        return true;
      }
    } catch {
      // Keep looking.
    }
  }

  return false;
}

http
  .createServer((request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
      const publicCandidate = path.join(publicDir, pathname.slice(1));
      if (fs.existsSync(publicCandidate)) {
        sendFile(response, publicCandidate);
        return;
      }
    }

    if (pathname === '/') {
      sendFile(response, path.join(rootDir, 'index.html'));
      return;
    }

    if (tryServe(pathname, response)) {
      return;
    }

    const htmlFallback = path.join(rootDir, 'index.html');
    if (fs.existsSync(htmlFallback)) {
      sendFile(response, htmlFallback);
      return;
    }

    response.statusCode = 404;
    response.end('Not Found');
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Node.js v${process.versions.node}`);
    console.log(`Static server running @ http://localhost:${port}`);
    console.log(`Root: ${rootDir}`);
  });
