import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { channel, recipientType, recipientId, subject, body } = z.object({
      channel: z.string(),
      recipientType: z.string(),
      recipientId: z.string(),
      subject: z.string().optional(),
      body: z.string(),
    }).parse(req.body);

    const message = await prisma.message.create({
      data: { organizationId: req.tenant.organizationId!, channel, recipientType, recipientId, subject, body },
    });
    res.status(201).json(message);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: { organizationId: req.tenant.organizationId! },
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (e) { next(e); }
});

export default router;
