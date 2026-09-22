import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T extends { id: string }> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(_id: string): Promise<T | null> {
    throw new Error('Not implemented');
  }

  async create(_data: Record<string, unknown>): Promise<T> {
    throw new Error('Not implemented');
  }

  async update(_id: string, _data: Record<string, unknown>): Promise<T> {
    throw new Error('Not implemented');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
