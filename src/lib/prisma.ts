import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
    // Connection pool settings are controlled via DATABASE_URL params:
    // ?connection_limit=20&pool_timeout=10
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
