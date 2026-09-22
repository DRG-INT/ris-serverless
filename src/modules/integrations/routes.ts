import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { provider, config } = z.object({ provider: z.string(), config: z.record(z.any()).default({}) }).parse(req.body);
    const integration = await prisma.integration.create({
      data: { organizationId: req.tenant.organizationId!, provider, config, status: 'active' },
    });
    res.status(201).json(integration);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const integrations = await prisma.integration.findMany({
      where: { organizationId: req.tenant.organizationId! },
    });
    res.json(integrations);
  } catch (e) { next(e); }
});

export default router;
