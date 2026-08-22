const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

console.log('========================================================');
console.log('         🚀 DAYFLOW HRMS - INITIALIZING SERVICES        ');
console.log('========================================================');

// 1. Auto-cleanup any old process holding port 5000 or 5173
if (isWindows) {
  [5000, 5173].forEach(port => {
    try {
      const stdout = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      const lines = stdout.trim().split('\n');
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && !isNaN(pid)) {
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          } catch (_) {}
        }
      });
    } catch (_) {}
  });
}

// 2. Auto-install server dependencies and seed database if downloaded fresh from GitHub ZIP
const serverDir = path.join(rootDir, 'server');
const serverModules = path.join(serverDir, 'node_modules');
if (!fs.existsSync(serverModules)) {
  console.log('\n📦 Installing Backend Dependencies (First-Time Setup)...');
  try {
    execSync(`${npmCmd} install`, { cwd: serverDir, stdio: 'inherit' });
    console.log('🗄️ Setting up SQLite database & seeding demo accounts...');
    execSync(`${npxCmd} prisma generate`, { cwd: serverDir, stdio: 'inherit' });
    execSync(`${npxCmd} prisma migrate dev --name init`, { cwd: serverDir, stdio: 'inherit' });
    execSync(`${npmCmd} run db:seed`, { cwd: serverDir, stdio: 'inherit' });
  } catch (err) {
    console.error('Backend setup error:', err);
  }
}

// 3. Auto-install client dependencies if downloaded fresh from GitHub ZIP
const clientDir = path.join(rootDir, 'client');
const clientModules = path.join(clientDir, 'node_modules');
if (!fs.existsSync(clientModules)) {
  console.log('\n📦 Installing Frontend Dependencies (First-Time Setup)...');
  try {
    execSync(`${npmCmd} install`, { cwd: clientDir, stdio: 'inherit' });
  } catch (err) {
    console.error('Frontend setup error:', err);
  }
}

// 4. Start Server
console.log('\n🚀 Starting Backend Server on http://localhost:5000 ...');
const serverProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

// 5. Start Client
console.log('🌐 Starting Frontend Client on http://localhost:5173 ...\n');
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (err) => {
  console.error('Server process error:', err);
});

clientProcess.on('error', (err) => {
  console.error('Client process error:', err);
});

process.on('SIGINT', () => {
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
});
