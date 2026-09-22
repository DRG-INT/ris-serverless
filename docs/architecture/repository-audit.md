# Repository Audit

## Stack
- Language: TypeScript (Node.js)
- Framework: Express.js
- Database: PostgreSQL via Prisma ORM
- Auth: JWT (Firebase-style)
- Validation: Zod
- Testing: Vitest + Supertest

## Architecture
Modular monolith with clearly separated bounded contexts:
- /modules/* with domain/, application/, infrastructure/, api/ structure

## Database
Shared PostgreSQL with organization_id tenant key.
Strict tenant scoping enforced via middleware.

## Testing
Unit tests for domain rules.
Integration tests for repositories.
API tests for critical endpoints.

## Status
Prototype in progress.
