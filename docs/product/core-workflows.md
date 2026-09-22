# Core Workflows

## Workflow 1: Member Registration
1. User submits registration form
2. System creates user account with hashed password
3. System creates organization
4. System assigns OWNER role
5. System returns access and refresh tokens
6. User can log in and access their organization

## Workflow 2: Activity Booking
1. Member views available activities/sessions
2. System checks eligibility (membership, credits)
3. System checks capacity
4. System creates booking or waitlist entry
5. System records credit transaction if applicable
6. System sends confirmation notification

## Workflow 3: Waitlist
1. Activity reaches capacity
2. Member is added to waitlist with sequential position
3. Booking is cancelled
4. System promotes next waitlist member
5. System notifies promoted member
6. Promoted member has time-limited window to confirm

## Workflow 4: Membership Purchase
1. Member selects membership product
2. System creates payment intent
3. Payment provider processes payment
4. Webhook confirms payment
5. System creates membership with activation
6. System generates invoice

## Workflow 5: Check-in
1. Member arrives at facility
2. Staff or member initiates check-in
3. System validates membership/booking
4. System records attendance
5. System emits analytics event

## Workflow 6: Expiring Membership
1. Scheduled job runs daily
2. System detects memberships expiring within threshold
3. System evaluates automation rules
4. System sends notification
5. System logs event in audit trail
