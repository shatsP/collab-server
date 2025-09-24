import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { setupWSConnection } from "./websocket.js";
import { log } from "./utils/logger.js";

const port = process.env.PORT || 1234;

const server = http.createServer();

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket, req) => {
  setupWSConnection(ws, req);
});

server.listen(port, () => {
  log.info(`🚀 Collaboration server running on ws://localhost:${port}`);
});
