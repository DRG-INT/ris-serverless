import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../core/database.js';
import { config } from '../core/config.js';
import { UnauthorizedError, AppError } from '../core/errors.js';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.JWT_ACCESS_TTL });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: 'refresh' }, config.JWT_SECRET, { expiresIn: config.JWT_REFRESH_TTL });
}

export async function createUser(email: string, password: string) {
  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, status: true, createdAt: true },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== 'active') {
    throw new UnauthorizedError('Invalid credentials');
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return user;
}
