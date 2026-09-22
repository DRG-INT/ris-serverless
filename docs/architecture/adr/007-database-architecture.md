# ADR-007: Database Architecture

## Status
Accepted

## Context
Need a relational database with strong consistency and support for complex queries.

## Decision
Use PostgreSQL as the primary database with Prisma ORM.

## Rationale
- ACID compliance
- Rich data types (JSONB, arrays)
- Strong ecosystem and tooling
- Prisma provides type-safe access

## Consequences
- Requires PostgreSQL for all environments
- Prisma migration system for schema changes
- JSONB used for flexible fields
