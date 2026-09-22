import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { memberId, items } = z.object({
      memberId: z.string().uuid(),
      items: z.array(z.object({ description: z.string(), quantity: z.number().int(), unitPrice: z.number() })),
    }).parse(req.body);

    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const invoice = await prisma.invoice.create({
      data: {
        organizationId: req.tenant.organizationId!,
        memberId,
        total,
        items: { create: items.map(i => ({ ...i, taxRate: 0 })) },
      },
      include: { items: true },
    });

    res.status(201).json(invoice);
  } catch (e) { next(e); }
});

router.get('/member/:memberId', async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { memberId: req.params.memberId, organizationId: req.tenant.organizationId! },
      include: { items: true },
    });
    res.json(invoices);
  } catch (e) { next(e); }
});

export default router;
