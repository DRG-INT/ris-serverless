import { Router, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (_req, res: Response) => {
  res.json({ status: 'alive' });
});

healthRouter.get('/ready', async (_req, res: Response) => {
  try {
    const { prisma } = await import('../core/database.js');
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});
