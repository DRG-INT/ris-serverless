import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();

router.use(tenantMiddleware, requireAuth, requireOrganization);

const createOrgSchema = z.object({ name: z.string().min(1), slug: z.string().min(1) });

router.post('/', async (req, res, next) => {
  try {
    const data = createOrgSchema.parse(req.body);
    const org = await prisma.organization.create({
      data: { name: data.name, slug: data.slug },
    });
    res.status(201).json(org);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const orgs = await prisma.organization.findMany({
      where: { id: req.tenant.organizationId! },
      include: { locations: true },
    });
    res.json(orgs);
  } catch (e) {
    next(e);
  }
});

const updateOrgSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  settings: z.unknown().optional(),
});

router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateOrgSchema.parse(req.body);
    const org = await prisma.organization.update({
      where: { id: req.params.id },
      data: data as Parameters<typeof prisma.organization.update>[0]['data'],
    });
    res.json(org);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const org = await prisma.organization.findFirst({
      where: { id: req.params.id },
      include: { locations: true },
    });
    if (!org || org.id !== req.tenant.organizationId) {
      throw new AppError(404, 'ORGANIZATION_NOT_FOUND', 'Organization not found');
    }
    if (!org) throw new AppError(404, 'ORGANIZATION_NOT_FOUND', 'Organization not found');
    res.json(org);
  } catch (e) {
    next(e);
  }
});

export default router;
