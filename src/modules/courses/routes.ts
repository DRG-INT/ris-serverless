import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({ name: z.string().min(1), description: z.string().optional(), capacity: z.number().int().positive().optional() });

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const course = await prisma.course.create({
      data: { organizationId: req.tenant.organizationId!, ...data },
    });
    res.status(201).json(course);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({ where: { organizationId: req.tenant.organizationId! } });
    res.json(courses);
  } catch (e) { next(e); }
});

export default router;
