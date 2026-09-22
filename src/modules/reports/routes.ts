import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.get('/revenue', async (req, res, next) => {
  try {
    const { from, to } = req.query as Record<string, string>;
    const payments = await prisma.payment.findMany({
      where: {
        organizationId: req.tenant.organizationId!,
        status: 'succeeded',
        ...(from && to ? { createdAt: { gte: new Date(from), lte: new Date(to) } } : {}),
      },
    });

    const total = payments.reduce((sum: number, p: { amount: unknown }) => sum + Number(p.amount), 0);
    res.json({ total, count: payments.length, currency: 'HUF' });
  } catch (e) { next(e); }
});

router.get('/bookings', async (req, res, next) => {
  try {
    const { from, to } = req.query as Record<string, string>;
    const bookings = await prisma.booking.findMany({
      where: {
        organizationId: req.tenant.organizationId!,
        ...(from && to ? { createdAt: { gte: new Date(from), lte: new Date(to) } } : {}),
      },
      include: { session: { include: { activity: true } } },
    });

    const statuses = bookings.map((b) => b.status);
    res.json({ total: bookings.length, byStatus: groupByString(statuses) });
  } catch (e) { next(e); }
});

router.get('/members', async (req, res, next) => {
  try {
    const total = await prisma.member.count({ where: { organizationId: req.tenant.organizationId! } });
    const active = await prisma.membership.count({
      where: { organizationId: req.tenant.organizationId!, status: 'active' },
    });
    res.json({ total, activeMemberships: active });
  } catch (e) { next(e); }
});

function groupByString(arr: string[]): Record<string, number> {
  return arr.reduce((acc: Record<string, number>, val: string) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export default router;
