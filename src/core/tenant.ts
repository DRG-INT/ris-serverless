import { Request, Response, NextFunction } from 'express';
import { prisma } from '../core/database.js';
import { UnauthorizedError } from '../core/errors.js';
import jwt from 'jsonwebtoken';

export interface TenantContext {
  organizationId: string | null;
  userId: string | null;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      tenant: TenantContext;
    }
  }
}

export async function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    req.tenant = { organizationId: null, userId: null, roles: [] };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userRoles = await prisma.userRole.findMany({
      where: { userId: decoded.userId },
      include: { role: true },
    });

    const roles = userRoles.map((ur: { role: { name: string } }) => ur.role.name);
    const organizationId = userRoles[0]?.organizationId || null;

    req.tenant = { organizationId, userId: decoded.userId, roles };
    next();
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.tenant.userId) {
    throw new UnauthorizedError();
  }
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const hasRole = req.tenant.roles.some(r => allowedRoles.includes(r) || r === 'OWNER');
    if (!hasRole) {
      throw new UnauthorizedError('Insufficient permissions');
    }
    next();
  };
}

export function requireOrganization(req: Request, _res: Response, next: NextFunction) {
  if (!req.tenant.organizationId) {
    throw new UnauthorizedError('Organization context required');
  }
  next();
}
