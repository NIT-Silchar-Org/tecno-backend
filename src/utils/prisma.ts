import { PrismaClient } from "@prisma/client";

/**
 * @description The Prisma Client for
 * PostgreSQL Prisma ORM
 */
const prisma = new PrismaClient();

export { prisma };
