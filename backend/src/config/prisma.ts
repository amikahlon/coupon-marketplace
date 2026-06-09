import { PrismaClient } from "@prisma/client";

// Use one Prisma client instance across the application (singleton)

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["warn", "error"],
});
