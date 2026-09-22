import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { source, notes, assignedTo } = z.object({
      source: z.string(),
      notes: z.string().optional(),
      assignedTo: z.string().optional(),
    }).parse(req.body);

    const lead = await prisma.lead.create({
      data: { organizationId: req.tenant.organizationId!, source, notes, assignedTo },
    });
    res.status(201).json(lead);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { organizationId: req.tenant.organizationId! },
    });
    res.json(leads);
  } catch (e) { next(e); }
});

router.patch('/:id/convert', async (req, res, next) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status: 'converted', convertedAt: new Date() },
    });
    res.json(lead);
  } catch (e) { next(e); }
});

export default router;
