import * as Y from "yjs";
import type { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { log } from "./utils/logger.js";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness";

export function setupAwareness(
  ws: WebSocket,
  _req: IncomingMessage,
  doc: Y.Doc,
  projectId: string
): number {
  // Attach Awareness instance to doc if not already
  let awareness: Awareness;
  if (!(doc as any)._awareness) {
    awareness = new Awareness(doc);
    (doc as any)._awareness = awareness;
  } else {
    awareness = (doc as any)._awareness;
  }

  const clientId = doc.clientID;

  // Track awareness updates from this client
  ws.on("message", (data: WebSocket.Data) => {
    try {
      if (typeof data === "string") return; // skip strings
      const update = new Uint8Array(data as ArrayBuffer);
      applyAwarenessUpdate(awareness, update, clientId); // ✅ correct method
    } catch (err) {
      log.error("Failed to apply awareness update", err);
    }
  });

  // Remove client state on disconnect
  ws.on("close", () => {
    awareness.removeClient(clientId); // ✅ correct method
    log.info(`❌ Client disconnected from project ${projectId}`);
  });

  return clientId;
}
