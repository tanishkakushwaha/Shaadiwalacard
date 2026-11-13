import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalDb = globalThis as unknown as { prisma?: PrismaClient };

export function db(): PrismaClient {
  if (globalDb.prisma) return globalDb.prisma;
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing. Follow README.md to connect PostgreSQL.");
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const client = new PrismaClient({ adapter });
  globalDb.prisma = client;
  return client;
}
