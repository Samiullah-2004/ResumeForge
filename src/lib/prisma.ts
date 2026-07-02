import { PrismaClient } from "@prisma/client";

// Prevents multiple PrismaClient instances in dev (Next.js hot reload creates
// a new module context on every save, which would otherwise spawn a new
// client — and eventually exhaust your DB connection pool).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
