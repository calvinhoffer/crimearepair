import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { createApp } from './createApp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const host = '0.0.0.0';
const port = Number(process.env.PORT || 3000);

function getNetworkUrl(currentPort: number): string | null {
  const interfaces = os.networkInterfaces();
  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) {
        return `http://${address.address}:${currentPort}`;
      }
    }
  }
  return null;
}

async function start() {
  const app = createApp();
  const vite = await createViteServer({
    root,
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    try {
      const template = await fs.readFile(path.resolve(root, 'index.html'), 'utf-8');
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });

  app.listen(port, host, () => {
    const networkUrl = getNetworkUrl(port);
    console.log(`Dev server is running at http://localhost:${port}`);
    if (networkUrl) {
      console.log(`Network: ${networkUrl}`);
    }
  });
}

start();
