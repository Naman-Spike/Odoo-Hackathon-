const { spawn, execSync } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('========================================================');
console.log('         🚀 DAYFLOW HRMS - INITIALIZING SERVICES        ');
console.log('========================================================');

// Automatically free ports 5000 and 5173 if held by an old process
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

// 1. Start Server
console.log('Starting Backend Server on port 5000...');
const serverProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Client
console.log('Starting Frontend Client on port 5173...');
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'client'),
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
