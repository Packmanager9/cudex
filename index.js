const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

let mainWindow;

// ---- Start Express + WebSocket server ----
const exapp = express();
const server = http.createServer(exapp);
const wss = new WebSocketServer({ server });

exapp.use(express.static(path.join(__dirname, ""))); // <-- put cudex.html here

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    ws.send("Echo: " + msg.toString());
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Express/WS running at http://localhost:3000");
});

// ---- Electron main window ----
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 700,
    webPreferences: {
      nodeIntegration: false, // safer: frontend JS won’t have full Node
    },
  });

  // Instead of file://, load from local Express server
  mainWindow.loadURL("http://localhost:3000/cudex.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
    server.close();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

