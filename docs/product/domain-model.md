# Domain Model

## Aggregates

### Organization
Root aggregate for multi-tenancy. Contains locations, members, staff, facilities, and all business entities.

### Member
Represents a customer/member of the organization. Contains profile data, consents, bookings, memberships, and attendance history.

### ClassSession
Represents a scheduled activity instance. Belongs to an activity and location. Has bookings and attendance records.

### Booking
Represents a reservation for a class session. Enforces capacity constraints and supports waitlist promotion.

### Membership
Represents a member's subscription to a membership product. Supports freezing, renewal, and cancellation.

### Pass
Represents a credit-based pass for booking activities. Tracks credit transactions immutably.

## Entities

### Core
- User, RefreshToken, Role, Permission, UserRole

### Organization
- Organization, Location, BusinessHour, TaxSetting, CurrencySetting

### Members
- Member, MemberConsent, CustomFieldDefinition, CustomFieldValue

### Staff
- Staff, StaffAvailability, InstructorProfile, StaffAssignment, StaffCommission, InstructorPayout

### Facilities
- Facility, Room, Resource

### Scheduling
- Activity, Course, ClassSession, RecurringSchedule, ScheduleException

### Bookings
- Booking, WaitlistEntry

### Memberships
- MembershipProduct, Membership, MembershipFreeze, MembershipRenewal, MembershipCancellation

### Credits
- Pass, CreditTransaction

### Payments
- Payment, Invoice, InvoiceItem

### Attendance
- Attendance

### CRM
- Lead

### Messaging
- Message, MessageTemplate, Campaign

### Automation
- AutomationRule

### Analytics
- AnalyticsEvent

### Integrations
- Integration

### Audit
- AuditLog

## Relationships

- Organization has many Locations, Members, Staff, Facilities, Activities, Memberships
- Member has many Bookings, Memberships, Passes, Attendances, Leads
- Activity has many ClassSessions
- ClassSession has many Bookings, Attendances
- Booking belongs to Member and ClassSession
- Membership belongs to Member and MembershipProduct
- Pass belongs to Member and has many CreditTransactions

## State Machines

### Booking
RESERVED -> CONFIRMED -> ATTENDED / NO_SHOW
RESERVED -> CANCELLED
CONFIRMED -> CANCELLED
WAITLISTED -> CONFIRMED (promotion)

### Membership
PENDING -> ACTIVE -> FROZEN -> ACTIVE
ACTIVE -> EXPIRED
ACTIVE -> CANCELLED

### Payment
PENDING -> SUCCEEDED / FAILED

## Invariants

- A member cannot have two active bookings for the same session
- Booking capacity cannot exceed session capacity
- Credit balance cannot go negative
- Waitlist positions are sequential and unique per session
- Tenant isolation is enforced at the repository layer
