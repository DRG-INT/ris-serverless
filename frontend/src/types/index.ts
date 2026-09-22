export interface User {
  id: string;
  email: string;
  organizationId: string;
  role: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export interface Member {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  registrationDate: string;
}

export interface Activity {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  capacity?: number;
  duration?: number;
  price?: number;
  status: string;
}

export interface ClassSession {
  id: string;
  organizationId: string;
  activityId: string;
  locationId: string;
  instructorId?: string;
  startsAt: string;
  endsAt: string;
  capacity?: number;
  status: string;
}

export interface Booking {
  id: string;
  organizationId: string;
  memberId: string;
  sessionId: string;
  status: string;
  source: string;
  createdAt: string;
}

export interface Membership {
  id: string;
  organizationId: string;
  memberId: string;
  productId: string;
  status: string;
  startsAt: string;
  expiresAt?: string;
}

export interface Payment {
  id: string;
  organizationId: string;
  memberId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  organizationId: string;
  memberId: string;
  sessionId: string;
  method: string;
  checkedInAt: string;
}

export interface Lead {
  id: string;
  organizationId: string;
  source: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface Facility {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  status: string;
}

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  timezone: string;
  phone?: string;
  email?: string;
  status: string;
}

export interface Staff {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  memberId: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface Message {
  id: string;
  organizationId: string;
  channel: string;
  recipientType: string;
  recipientId: string;
  subject?: string;
  body: string;
  status: string;
  createdAt: string;
}

export interface AutomationRule {
  id: string;
  organizationId: string;
  name: string;
  event: string;
  isActive: boolean;
}

export interface Integration {
  id: string;
  organizationId: string;
  provider: string;
  status: string;
  lastSyncAt?: string;
}

export interface AnalyticsEvent {
  id: string;
  organizationId: string;
  eventType: string;
  entityType?: string;
  entityId?: string;
  properties: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
