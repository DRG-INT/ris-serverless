import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';
import { eventBus } from '../../core/event-bus.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

router.post('/', async (req, res, next) => {
  try {
    const { name, event, conditions, actions } = z.object({
      name: z.string().min(1),
      event: z.string(),
      conditions: z.record(z.any()).default({}),
      actions: z.array(z.record(z.any())).default([]),
    }).parse(req.body);

    const rule = await prisma.automationRule.create({
      data: { organizationId: req.tenant.organizationId!, name, event, conditions, actions },
    });

    eventBus.on(event, async (payload: Record<string, unknown>) => {
      const rules = await prisma.automationRule.findMany({
        where: { organizationId: req.tenant.organizationId!, event, isActive: true },
      });
      rules.forEach((rule) => executeRule(rule as { id: string; name: string; conditions: unknown; actions: unknown[] }, payload));
    });

    res.status(201).json(rule);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const rules = await prisma.automationRule.findMany({
      where: { organizationId: req.tenant.organizationId! },
    });
    res.json(rules);
  } catch (e) { next(e); }
});

async function executeRule(rule: { id: string; name: string; conditions: unknown; actions: unknown[] }, payload: Record<string, unknown>) {
  console.log(`Executing automation rule: ${rule.name}`);
}

export default router;
