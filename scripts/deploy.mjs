import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(root, 'dist');

if (!existsSync(distDir)) {
  console.error('dist/ が見つかりません。先に npm run build を実行してください。');
  process.exit(1);
}

const remote = execSync('git remote get-url origin', {
  cwd: root,
  encoding: 'utf8',
}).trim();

const workDir = join(root, '.deploy-worktree');
rmSync(workDir, { recursive: true, force: true });
mkdirSync(workDir, { recursive: true });

execSync(`git clone --branch main --single-branch "${remote}" "${workDir}"`, {
  stdio: 'inherit',
});

for (const entry of readdirSync(workDir)) {
  if (entry === '.git') continue;
  rmSync(join(workDir, entry), { recursive: true, force: true });
}

cpSync(distDir, workDir, { recursive: true });

execSync('git add -A', { cwd: workDir, stdio: 'inherit' });
const status = execSync('git status --porcelain', {
  cwd: workDir,
  encoding: 'utf8',
}).trim();

if (!status) {
  console.log('デプロイする変更はありません。');
  rmSync(workDir, { recursive: true, force: true });
  process.exit(0);
}

execSync('git commit -m "Deploy v2"', { cwd: workDir, stdio: 'inherit' });
execSync('git push origin main', { cwd: workDir, stdio: 'inherit' });

rmSync(workDir, { recursive: true, force: true });
console.log('デプロイ完了: https://kg9n3n8y.github.io/fudanagashi/');
