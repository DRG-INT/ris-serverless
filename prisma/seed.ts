import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const org = await prisma.organization.upsert({
    where: { slug: 'ris-demo' },
    update: {},
    create: { name: 'Recreation in Sport Demo', slug: 'ris-demo', settings: { timezone: 'Europe/Budapest' } },
  });

  const loc = await prisma.location.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000001', organizationId: org.id, name: 'Budapest Downtown', timezone: 'Europe/Budapest' },
  });

  const ownerRole = await prisma.role.upsert({ where: { name: 'OWNER' }, update: {}, create: { name: 'OWNER', description: 'Organization owner' } });
  const adminRole = await prisma.role.upsert({ where: { name: 'ADMIN' }, update: {}, create: { name: 'ADMIN', description: 'Administrator' } });
  const instructorRole = await prisma.role.upsert({ where: { name: 'INSTRUCTOR' }, update: {}, create: { name: 'INSTRUCTOR', description: 'Instructor' } });
  const memberRole = await prisma.role.upsert({ where: { name: 'MEMBER' }, update: {}, create: { name: 'MEMBER', description: 'Member' } });

  const permissions = [
    { name: 'organization.read', resource: 'organization', action: 'read' },
    { name: 'organization.write', resource: 'organization', action: 'write' },
    { name: 'members.read', resource: 'members', action: 'read' },
    { name: 'members.write', resource: 'members', action: 'write' },
    { name: 'bookings.read', resource: 'bookings', action: 'read' },
    { name: 'bookings.write', resource: 'bookings', action: 'write' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({ where: { name: perm.name }, update: {}, create: perm });
  }

  const passwordHash = await bcrypt.hash('password123', 12);

  const users = [
    { email: 'owner@example.test', role: ownerRole, firstName: 'Owner', lastName: 'User' },
    { email: 'admin@example.test', role: adminRole, firstName: 'Admin', lastName: 'User' },
    { email: 'trainer@example.test', role: instructorRole, firstName: 'Trainer', lastName: 'User' },
    { email: 'member@example.test', role: memberRole, firstName: 'Member', lastName: 'User' },
  ];

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, passwordHash, status: 'active' },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId_organizationId: { userId: user.id, roleId: u.role.id, organizationId: org.id } },
      update: {},
      create: { userId: user.id, roleId: u.role.id, organizationId: org.id },
    });
  }

  const yogaCourse = await prisma.course.create({
    data: { organizationId: org.id, name: 'Yoga', category: 'Mind & Body', duration: 60, capacity: 15 },
  });

  const pilatesCourse = await prisma.course.create({
    data: { organizationId: org.id, name: 'Pilates', category: 'Mind & Body', duration: 45, capacity: 12 },
  });

  const facility = await prisma.facility.create({
    data: { organizationId: org.id, name: 'Main Studio', description: 'Primary yoga and pilates studio' },
  });

  const room = await prisma.room.create({
    data: { facilityId: facility.id, name: 'Studio A', capacity: 20 },
  });

  const activity = await prisma.activity.create({
    data: { organizationId: org.id, courseId: yogaCourse.id, type: 'GROUP_CLASS', name: 'Morning Yoga', capacity: 15, duration: 60, facilityId: facility.id },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const sessionEnd = new Date(tomorrow);
  sessionEnd.setHours(10, 0, 0, 0);

  await prisma.classSession.create({
    data: {
      organizationId: org.id,
      activityId: activity.id,
      locationId: loc.id,
      startsAt: tomorrow,
      endsAt: sessionEnd,
      capacity: 15,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
