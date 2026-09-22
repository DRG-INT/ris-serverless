import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../../src/core/database.js';

describe('Database Connection', () => {
  it('connects to database', async () => {
    await prisma.$queryRaw`SELECT 1`;
    expect(true).toBe(true);
  });
});

describe('Domain Model', () => {
  it('has expected tables', async () => {
    const result = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    const tables = result.map(r => r.tablename);
    expect(tables).toContain('organizations');
    expect(tables).toContain('members');
    expect(tables).toContain('bookings');
    expect(tables).toContain('class_sessions');
  });
});
