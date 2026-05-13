import express from 'express';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './createApp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.resolve(root, 'dist');
const host = '0.0.0.0';
const port = Number(process.env.PORT || 4173);

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

const app = createApp();

app.use(express.static(distDir));
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distDir, 'index.html'));
});

app.listen(port, host, () => {
  const networkUrl = getNetworkUrl(port);
  console.log(`Preview server is running at http://localhost:${port}`);
  if (networkUrl) {
    console.log(`Network: ${networkUrl}`);
  }
});
