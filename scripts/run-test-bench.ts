import { spawn } from 'child_process';
import path from 'path';

const args = ['playwright', 'test', '-c', 'playwright.bench.config.ts'];
console.log('Running bench suite:', args.join(' '));
const proc = spawn('npx', args, { stdio: 'inherit', env: { ...process.env } });
proc.on('exit', code => {
  console.log('Bench suite exited with code', code);
  console.log('Latest summary at', path.join(process.cwd(), 'test-results', 'bench-latest.json'));
  process.exit(code ?? 1);
});
