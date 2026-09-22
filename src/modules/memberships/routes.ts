import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.get('/', async (req, res, next) => {
  try {
    const memberships = await prisma.membership.findMany({
      where: { organizationId: req.tenant.organizationId! },
      include: { member: true, product: true },
    });
    res.json(memberships);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { memberId, productId, startsAt } = z.object({
      memberId: z.string().uuid(),
      productId: z.string().uuid(),
      startsAt: z.string().datetime().optional(),
    }).parse(req.body);

    const product = await prisma.membershipProduct.findFirst({
      where: { id: productId, organizationId: req.tenant.organizationId! },
    });

    if (!product) throw new AppError(404, 'MEMBERSHIP_PRODUCT_NOT_FOUND', 'Product not found');

    const membership = await prisma.membership.create({
      data: {
        organizationId: req.tenant.organizationId!,
        memberId,
        productId,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: new Date(Date.now() + product.durationDays * 24 * 60 * 60 * 1000),
        status: 'active',
      },
      include: { member: true, product: true },
    });

    res.status(201).json(membership);
  } catch (e) { next(e); }
});

export default router;
