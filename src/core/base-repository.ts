import { Prisma, PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T extends { id: string }> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<T | null> {
    throw new Error('Not implemented');
  }

  async create(data: Record<string, unknown>): Promise<T> {
    throw new Error('Not implemented');
  }

  async update(id: string, data: Record<string, unknown>): Promise<T> {
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
