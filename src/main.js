const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "OpenClaw 一键部署工具",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: true,
    autoHideMenuBar: true
  });

  win.loadFile('src/index.html');
}

app.whenReady().then(createWindow);

// 监听前端部署请求
ipcMain.on('start-deploy', (event) => {
  event.reply('deploy-log', '🚀 启动部署进程...');
  
  // 模拟执行之前的部署脚本
  const deployProcess = exec('python3 /root/.openclaw/workspace/scripts/openclaw_deployer.py');

  deployProcess.stdout.on('data', (data) => {
    event.reply('deploy-log', data.toString());
  });

  deployProcess.stderr.on('data', (data) => {
    event.reply('deploy-log', `⚠️ ERROR: ${data.toString()}`);
  });

  deployProcess.on('close', (code) => {
    event.reply('deploy-log', `🎉 部署结束，退出码: ${code}`);
    if (code === 0) {
        event.reply('deploy-success');
    }
  });
});
