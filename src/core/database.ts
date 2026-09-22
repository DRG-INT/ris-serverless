import { PrismaClient } from '@prisma/client';
import { config } from './config.js';

export const prisma = new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export class Database {
  static async $connect() {
    await prisma.$connect();
  }

  static async $disconnect() {
    await prisma.$disconnect();
  }

  static async $queryRaw(query: unknown[], params?: unknown[]) {
    return prisma.$queryRawUnsafe(query.join(''), ...(params || []));
  }
}

export default prisma;
