import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const cwd = process.cwd();
const outDir = path.join(cwd, 'out');
const serveEntry = path.join(cwd, 'node_modules', 'serve', 'build', 'main.js');

if (!existsSync(outDir)) {
  console.error('Missing out/ directory. Run npm run build first.');
  process.exit(1);
}
if (!existsSync(serveEntry)) {
  console.error('Missing serve package. Run npm install first.');
  process.exit(1);
}

const server = spawn(
  process.execPath,
  [serveEntry, outDir, '-l', '4173', '--no-port-switching'],
  {
    stdio: 'inherit',
  }
);

server.on('exit', code => {
  process.exit(code ?? 0);
});
