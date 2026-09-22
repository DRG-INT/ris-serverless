import { Router } from 'express';
import { prisma } from '../../core/database.js';
import { tenantMiddleware, requireAuth, requireOrganization } from '../../core/tenant.js';
import { z } from 'zod';
import { AppError, ConflictError } from '../../core/errors.js';
import { eventBus } from '../../core/event-bus.js';

const router = Router();
router.use(tenantMiddleware, requireAuth, requireOrganization);

const createSchema = z.object({
  sessionId: z.string(),
  memberId: z.string(),
  idempotencyKey: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);

    const session = await prisma.classSession.findFirst({
      where: { id: data.sessionId, organizationId: req.tenant.organizationId! },
      include: { _count: { select: { bookings: { where: { status: { in: ['reserved', 'confirmed'] } } } } } },
    });

    if (!session) throw new AppError(404, 'SESSION_NOT_FOUND', 'Session not found');

    const existingBooking = await prisma.booking.findFirst({
      where: {
        sessionId: data.sessionId,
        memberId: data.memberId,
        status: { in: ['reserved', 'confirmed', 'attended'] },
      },
    });

    if (existingBooking) {
      throw new ConflictError('DUPLICATE_BOOKING', 'Member already has an active booking for this session');
    }

    let status: string = 'reserved';
    if (session.capacity && session._count.bookings >= session.capacity) {
      status = 'waitlisted';
      await prisma.waitlistEntry.create({
        data: {
          organizationId: req.tenant.organizationId!,
          sessionId: data.sessionId,
          memberId: data.memberId,
          position: await getNextPosition(data.sessionId),
        },
      });
    } else {
      status = 'confirmed';
      await prisma.booking.create({
        data: {
          organizationId: req.tenant.organizationId!,
          sessionId: data.sessionId,
          memberId: data.memberId,
          status,
          idempotencyKey: data.idempotencyKey,
        },
      });
    }

    await eventBus.emit('booking.created', { sessionId: data.sessionId, memberId: data.memberId, status });

    res.status(201).json({ sessionId: data.sessionId, memberId: data.memberId, status });
  } catch (e) {
    next(e);
  }
});

router.post('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, organizationId: req.tenant.organizationId! },
      include: { session: true },
    });

    if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
    if (booking.status === 'cancelled') throw new AppError(400, 'BOOKING_ALREADY_CANCELLED', 'Booking already cancelled');

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled', cancelledAt: new Date() },
    });

    await promoteNextWaitlist(booking.sessionId);

    await eventBus.emit('booking.cancelled', { bookingId: booking.id, sessionId: booking.sessionId });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

router.get('/member/:memberId', async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { memberId: req.params.memberId, organizationId: req.tenant.organizationId! },
      include: { session: { include: { activity: true, location: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (e) { next(e); }
});

async function getNextPosition(sessionId: string): Promise<number> {
  const last = await prisma.waitlistEntry.findFirst({
    where: { sessionId },
    orderBy: { position: 'desc' },
  });
  return (last?.position || 0) + 1;
}

async function promoteNextWaitlist(sessionId: string) {
  const next = await prisma.waitlistEntry.findFirst({
    where: { sessionId },
    orderBy: { position: 'asc' },
  });

  if (!next) return;

  const session = await prisma.classSession.findFirst({
    where: { id: sessionId },
    include: { _count: { select: { bookings: { where: { status: { in: ['reserved', 'confirmed'] } } } } } },
  });

  if (session && session.capacity && session._count.bookings >= session.capacity) return;

  await prisma.$transaction([
    prisma.booking.create({
      data: { organizationId: next.organizationId, sessionId, memberId: next.memberId, status: 'confirmed' },
    }),
    prisma.waitlistEntry.delete({ where: { id: next.id } }),
  ]);

  await eventBus.emit('waitlist.promoted', { sessionId, memberId: next.memberId });
}

export default router;
