import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({ name: z.string().min(1), description: z.string().optional() });

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const facility = await prisma.facility.create({
      data: { organizationId: req.tenant.organizationId!, ...data },
    });
    res.status(201).json(facility);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const facilities = await prisma.facility.findMany({
      where: { organizationId: req.tenant.organizationId! },
      include: { rooms: true, resources: true },
    });
    res.json(facilities);
  } catch (e) { next(e); }
});

export default router;
