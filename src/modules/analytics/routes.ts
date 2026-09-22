import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { eventType, entityType, entityId, properties } = z.object({
      eventType: z.string(),
      entityType: z.string().optional(),
      entityId: z.string().optional(),
      properties: z.record(z.any()).default({}),
    }).parse(req.body);

    const event = await prisma.analyticsEvent.create({
      data: { organizationId: req.tenant.organizationId!, eventType, entityType, entityId, properties },
    });
    res.status(201).json(event);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const { eventType, from, to } = req.query as Record<string, string>;
    const where: Record<string, unknown> = { organizationId: req.tenant.organizationId! };
    if (eventType) where.eventType = eventType;
    if (from && to) where.createdAt = { gte: new Date(from), lte: new Date(to) };

    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(events);
  } catch (e) { next(e); }
});

export default router;
