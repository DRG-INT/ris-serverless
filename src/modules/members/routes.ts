import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

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
    const member = await prisma.member.create({
      data: { organizationId: req.tenant.organizationId!, ...data },
    });
    res.status(201).json(member);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '20' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where: { organizationId: req.tenant.organizationId! },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.member.count({ where: { organizationId: req.tenant.organizationId! } }),
    ]);
    res.json({ data: members, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const member = await prisma.member.findFirst({
      where: { id: req.params.id, organizationId: req.tenant.organizationId! },
    });
    if (!member) throw new AppError(404, 'MEMBER_NOT_FOUND', 'Member not found');
    res.json(member);
  } catch (e) { next(e); }
});

export default router;
