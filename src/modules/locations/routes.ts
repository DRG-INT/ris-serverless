import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({ name: z.string().min(1), timezone: z.string().default('UTC') });

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const loc = await prisma.location.create({
      data: { organizationId: req.tenant.organizationId!, ...data },
    });
    res.status(201).json(loc);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const locs = await prisma.location.findMany({
      where: { organizationId: req.tenant.organizationId! },
    });
    res.json(locs);
  } catch (e) { next(e); }
});

export default router;
