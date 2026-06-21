import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error"],
});

// Eagerly connect on startup so cold-start DB errors don't hit the first user request
prisma.$connect().catch((err) => {
  console.error("Prisma initial connection failed:", err.message);
});

export default prisma;
