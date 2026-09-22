import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { memberId, amount, currency, idempotencyKey } = z.object({
      memberId: z.string().uuid(),
      amount: z.number().positive(),
      currency: z.string().default('HUF'),
      idempotencyKey: z.string().optional(),
    }).parse(req.body);

    const existing = await prisma.payment.findFirst({
      where: { idempotencyKey: idempotencyKey || undefined, organizationId: req.tenant.organizationId! },
    });

    if (existing) {
      return res.json(existing);
    }

    const payment = await prisma.payment.create({
      data: {
        organizationId: req.tenant.organizationId!,
        memberId,
        amount,
        currency,
        provider: 'mock',
        idempotencyKey,
        status: 'succeeded',
      },
    });

    res.status(201).json(payment);
  } catch (e) { next(e); }
});

router.get('/member/:memberId', async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { memberId: req.params.memberId, organizationId: req.tenant.organizationId! },
    });
    res.json(payments);
  } catch (e) { next(e); }
});

export default router;
