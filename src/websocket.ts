import * as Y from "yjs";
import type { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { setupAwareness } from "./awareness.js";
import { log } from "./utils/logger.js";

// Keep docs in memory per projectId
const docs = new Map<string, Y.Doc>();

export function setupWSConnection(ws: WebSocket, req: IncomingMessage) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const projectId = url.pathname.slice(1) || "default";

  let doc = docs.get(projectId);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(projectId, doc);
    log.info(`🆕 Created new Y.Doc for project: ${projectId}`);
  }

  // Awareness & collaboration setup
  const clientId = setupAwareness(ws, req, doc, projectId);
  log.info(`🔗 Client connected (clientId=${clientId}) to project: ${projectId}`);
}
