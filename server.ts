import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

const PORT = Number(process.env.PORT) || 3000;
const CACHE_DIR = path.resolve('.cache/imgly');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

async function startServer() {
  const app = express();

  // Allow cross-origin requests & isolate headers if needed
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Serve or proxy /api/imgly/*
  app.get('/api/imgly/:file(*)', async (req, res) => {
    const fileName = req.params.file;
    const localFilePath = path.join(CACHE_DIR, fileName);

    // If cached locally, serve immediately with correct Content-Type
    if (fs.existsSync(localFilePath)) {
      if (fileName.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
      } else if (fileName.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json');
      } else if (fileName.endsWith('.mjs') || fileName.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return fs.createReadStream(localFilePath).pipe(res);
    }

    // Otherwise proxy from staticimgly CDN and save to cache
    try {
      const targetUrl = `https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/${fileName}`;
      const response = await fetch(targetUrl);
      if (!response.ok) {
        return res.status(response.status).send(`Resource ${fileName} not found on CDN`);
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save to local cache in background
      fs.writeFile(localFilePath, buffer, (err) => {
        if (err) console.error('Failed to write cache for', fileName, err);
      });

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.send(buffer);
    } catch (err) {
      console.error('Proxy error for', fileName, err);
      res.status(502).send('Error proxying model asset');
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', cacheDirExists: fs.existsSync(CACHE_DIR) });
  });

  // Mount Vite middlewares in development or static dist in production
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve('dist');

  if (isProd && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
