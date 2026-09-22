import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const staff = await prisma.staff.create({
      data: { organizationId: req.tenant.organizationId!, ...data },
    });
    res.status(201).json(staff);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const staff = await prisma.staff.findMany({
      where: { organizationId: req.tenant.organizationId! },
    });
    res.json(staff);
  } catch (e) { next(e); }
});

export default router;
