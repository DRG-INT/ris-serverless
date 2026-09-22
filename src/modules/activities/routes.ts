import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';
import { eventBus } from '../../core/event-bus.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
  courseId: z.string().uuid().optional(),
  capacity: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional(),
  price: z.number().nonnegative().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const activity = await prisma.activity.create({
      data: { organizationId: req.tenant.organizationId!, ...data },
    });
    await eventBus.emit('activity.created', { activityId: activity.id });
    res.status(201).json(activity);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { organizationId: req.tenant.organizationId! },
      include: { course: true },
    });
    res.json(activities);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const activity = await prisma.activity.findFirst({
      where: { id: req.params.id, organizationId: req.tenant.organizationId! },
      include: { course: true },
    });
    if (!activity) throw new AppError(404, 'ACTIVITY_NOT_FOUND', 'Activity not found');
    res.json(activity);
  } catch (e) { next(e); }
});

export default router;
