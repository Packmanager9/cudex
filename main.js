const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let mainWindow;
let serverProcess;

app.on("ready", () => {
  // Start the Express/WS server in a separate process
  serverProcess = fork(path.join(__dirname, "server.js"));

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // safer
    },
  });

  // Load the frontend over HTTP (NOT file://)
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (serverProcess) serverProcess.kill();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
