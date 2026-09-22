# ADR-005: Payment Abstraction

## Status
Accepted

## Context
Payments need to support multiple providers without coupling the domain to a specific provider.

## Decision
Create a PaymentProvider interface with mock Stripe implementation. Domain entities store provider references without direct Stripe dependencies.

## Rationale
- Clean separation of concerns
- Easy to add new providers
- Mock mode allows development without real credentials

## Consequences
- Additional abstraction layer
- Mock mode must be clearly documented
- Webhook handling must be provider-agnostic
