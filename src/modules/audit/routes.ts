import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { action, entityType, entityId, metadata, ip } = z.object({
      action: z.string(),
      entityType: z.string(),
      entityId: z.string(),
      metadata: z.record(z.any()).default({}),
      ip: z.string().optional(),
    }).parse(req.body);

    const log = await prisma.auditLog.create({
      data: {
        organizationId: req.tenant.organizationId!,
        actorId: req.tenant.userId,
        action,
        entityType,
        entityId,
        metadata,
        ip: ip || req.ip,
      },
    });
    res.status(201).json(log);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const { action, entityType, from, to } = req.query as Record<string, string>;
    const where: Record<string, unknown> = { organizationId: req.tenant.organizationId! };
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (from && to) where.createdAt = { gte: new Date(from), lte: new Date(to) };

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(logs);
  } catch (e) { next(e); }
});

export default router;
