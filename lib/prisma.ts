import { PrismaClient } from "@prisma/client";

/**
 * Standard Next.js Prisma singleton — avoids exhausting DB connections from
 * hot-reloading in development.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
