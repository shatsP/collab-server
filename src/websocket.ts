import { WebSocketServer, WebSocket } from "ws";
import * as Y from "yjs";
import { saveSnapshot, loadSnapshot } from "./persistence.js";

interface DocMap {
  [projectId: string]: Y.Doc;
}

export const docs: DocMap = {};

export function startWSServer(port: number) {
  const wss = new WebSocketServer({ port });
  console.log(`🟢 Collaboration WS server running on ws://localhost:${port}`);

  wss.on("connection", async (ws: WebSocket, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const projectId = url.searchParams.get("projectId") || "default";

    let doc = docs[projectId];
    if (!doc) {
      doc = new Y.Doc();

      const snapshot = await loadSnapshot(projectId);
      if (snapshot) Y.applyUpdate(doc, snapshot);

      docs[projectId] = doc;

      setInterval(async () => {
        const update = Y.encodeStateAsUpdate(doc!);
        await saveSnapshot(projectId, update);
        console.log(`💾 Saved snapshot for project ${projectId}`);
      }, 30_000);
    }

    // Sync Yjs updates with connected WS client
    ws.on("message", (data: Uint8Array) => {
      try {
        Y.applyUpdate(doc!, new Uint8Array(data));
        // Broadcast to other clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });
      } catch (err) {
        console.error("⚠️ Failed to apply update", err);
      }
    });

    console.log(`🔗 WS client connected for project ${projectId}`);
  });
}
