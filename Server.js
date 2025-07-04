// server.js
require("dotenv").config();
const WebSocket = require("ws");
const http = require("http");

const port = process.env.PORT || 3001;
const server = http.createServer();

const wss = new WebSocket.Server({ server, path: "/sync" });

wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());

    try {
      const data = JSON.parse(message);
      // Broadcast to other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (e) {
      console.error("Invalid message format", e);
    }
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

server.listen(port, () => {
  console.log(`🚀 WebSocket server running on port ${port}`);
});
