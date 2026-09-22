import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({
  activityId: z.string().uuid(),
  locationId: z.string().uuid(),
  instructorId: z.string().uuid().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  capacity: z.number().int().positive().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const session = await prisma.classSession.create({
      data: {
        organizationId: req.tenant.organizationId!,
        ...data,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      },
    });
    res.status(201).json(session);
  } catch (e) { next(e); }
});

router.get('/activity/:activityId', async (req, res, next) => {
  try {
    const sessions = await prisma.classSession.findMany({
      where: { organizationId: req.tenant.organizationId!, activityId: req.params.activityId },
      orderBy: { startsAt: 'asc' },
    });
    res.json(sessions);
  } catch (e) { next(e); }
});

export default router;
