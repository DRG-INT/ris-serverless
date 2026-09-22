import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({ name: z.string().min(1), type: z.string(), facilityId: z.string().uuid().optional(), capacity: z.number().int().positive().optional() });

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const resource = await prisma.resource.create({
      data: { name: data.name, type: data.type, facilityId: data.facilityId || null, capacity: data.capacity || null },
    });
    res.status(201).json(resource);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { facility: { organizationId: req.tenant.organizationId! } },
      include: { facility: true },
    });
    res.json(resources);
  } catch (e) { next(e); }
});

export default router;
