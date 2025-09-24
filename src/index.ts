import express from "express";
import { startWSServer } from "./websocket.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (_, res) => res.send("Collab server running"));

app.listen(PORT, () => {
  console.log(`🌐 HTTP server running on http://localhost:${PORT}`);
});

// Start WS server on same port (or another)
startWSServer(1234);
