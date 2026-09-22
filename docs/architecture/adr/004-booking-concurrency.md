# ADR-004: Booking Concurrency

## Status
Accepted

## Context
Multiple users may attempt to book the same session simultaneously.

## Decision
Use database transactions and Prisma's built-in transaction support. Capacity checks happen inside transactions with pessimistic locking where needed.

## Rationale
- Database-level consistency
- No race conditions
- Deterministic behavior under load

## Consequences
- Slightly higher latency for booking operations
- Need to handle transaction timeouts
- Waitlist promotion happens after cancellation
