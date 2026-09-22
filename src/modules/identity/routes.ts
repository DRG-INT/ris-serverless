import { Router } from 'express';
import { requireAuth } from '../../core/tenant.js';
import { generateAccessToken, generateRefreshToken, authenticateUser, createUser } from '../../core/auth.js';
import { prisma } from '../../core/database.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../../core/errors.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError(409, 'DUPLICATE_EMAIL', 'Email already registered');
    }

    const user = await prisma.$transaction(async (tx: any) => {
      const u = await createUser(data.email, data.password);
      const org = await tx.organization.create({
        data: { name: data.organizationName, slug: data.email.split('@')[0] },
      });
      await tx.userRole.create({
        data: { userId: u.id, roleId: (await tx.role.findFirst({ where: { name: 'OWNER' } }))!.id, organizationId: org.id },
      });
      return { user: u, organization: org };
    });

    const accessToken = generateAccessToken(user.user.id);
    const refreshToken = generateRefreshToken(user.user.id);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user.user.id, email: user.user.email, organizationId: user.organization.id },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await authenticateUser(email, password);

    const userRole = await prisma.userRole.findFirst({
      where: { userId: user.id },
      include: { role: true },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        organizationId: userRole?.organizationId,
        role: userRole?.role.name,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError(401, 'AUTHENTICATION_REQUIRED', 'Refresh token required');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string; type: string };
    if (decoded.type !== 'refresh') {
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid token type');
    }

    const token = await prisma.refreshToken.findFirst({
      where: { userId: decoded.userId, token: refreshToken, revokedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!token) {
      throw new AppError(401, 'INVALID_TOKEN', 'Refresh token not found or expired');
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    await prisma.refreshToken.update({
      where: { id: token.id },
      data: { revokedAt: new Date() },
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (e) {
    next(e);
  }
});

router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { userId: req.tenant.userId!, token: refreshToken },
        data: { revokedAt: new Date() },
      });
    }
    res.json({ message: 'Logged out' });
  } catch (e) {
    next(e);
  }
});

export default router;
