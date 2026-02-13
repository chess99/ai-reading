import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const cwd = process.cwd();
const outDir = path.join(cwd, 'out');
const previewRoot = path.join(cwd, '.preview-site');
const mountedSiteDir = path.join(previewRoot, 'ai-reading');

if (!existsSync(outDir)) {
  console.error('Missing out/ directory. Run npm run build first.');
  process.exit(1);
}

rmSync(previewRoot, { recursive: true, force: true });
mkdirSync(previewRoot, { recursive: true });
cpSync(outDir, mountedSiteDir, { recursive: true });

const server = spawn('npx', ['serve', '.preview-site', '-l', '4173'], {
  stdio: 'inherit',
  shell: true,
});

server.on('exit', code => {
  process.exit(code ?? 0);
});
