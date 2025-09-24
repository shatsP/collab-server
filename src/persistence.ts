import { PrismaClient } from "@prisma/client";
import * as Y from "yjs";

const prisma = new PrismaClient();

export async function saveSnapshot(projectId: string, update: Uint8Array) {
  await prisma.snapshot.create({
    data: {
      projectId,
      data: Buffer.from(update),
    },
  });
}

export async function loadSnapshot(projectId: string): Promise<Uint8Array | null> {
  const latest = await prisma.snapshot.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) return null;
  return new Uint8Array(latest.data);
}
