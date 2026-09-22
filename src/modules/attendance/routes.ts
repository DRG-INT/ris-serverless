import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { memberId, sessionId, method } = z.object({
      memberId: z.string().uuid(),
      sessionId: z.string(),
      method: z.string().default('manual'),
    }).parse(req.body);

    const attendance = await prisma.attendance.create({
      data: {
        organizationId: req.tenant.organizationId!,
        memberId,
        sessionId,
        method: method || 'manual',
      },
    });

    res.status(201).json(attendance);
  } catch (e) { next(e); }
});

router.get('/session/:sessionId', async (req, res, next) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { sessionId: req.params.sessionId, organizationId: req.tenant.organizationId! },
      include: { member: true },
    });
    res.json(attendance);
  } catch (e) { next(e); }
});

export default router;
