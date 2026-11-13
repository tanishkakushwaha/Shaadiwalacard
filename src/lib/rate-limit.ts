import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";

export async function allowRequest(bucket: string, identifier: string, limit: number, minutes = 15): Promise<boolean> {
  const interval = minutes * 60_000;
  const window = Math.floor(Date.now() / interval);
  const hash = createHash("sha256").update(identifier).digest("hex");
  const record = await db().rateLimit.upsert({
    where: { id: `${bucket}:${window}:${hash}` },
    create: { id: `${bucket}:${window}:${hash}`, expiresAt: new Date((window + 1) * interval) },
    update: { count: { increment: 1 } }
  });
  return record.count <= limit;
}
