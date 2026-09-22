import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { memberId, type, creditsTotal, expiresAt } = z.object({
      memberId: z.string().uuid(),
      type: z.string(),
      creditsTotal: z.number().int().positive(),
      expiresAt: z.string().datetime().optional(),
    }).parse(req.body);

    const pass = await prisma.pass.create({
      data: {
        organizationId: req.tenant.organizationId!,
        memberId,
        type,
        creditsTotal,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    await prisma.creditTransaction.create({
      data: {
        passId: pass.id,
        type: 'CREDIT_GRANTED',
        amount: creditsTotal,
        balanceAfter: creditsTotal,
      },
    });

    res.status(201).json(pass);
  } catch (e) { next(e); }
});

router.get('/member/:memberId', async (req, res, next) => {
  try {
    const passes = await prisma.pass.findMany({
      where: { memberId: req.params.memberId, organizationId: req.tenant.organizationId! },
      include: { creditTx: true },
    });
    res.json(passes);
  } catch (e) { next(e); }
});

export default router;
