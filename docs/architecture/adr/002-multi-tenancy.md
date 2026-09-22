# ADR-002: Multi-tenancy

## Status
Accepted

## Context
The platform must support multiple organizations with strict data isolation.

## Decision
Use shared PostgreSQL database with organization_id tenant key and strict repository/service tenant scoping via middleware.

## Rationale
- Cost-effective for initial deployment
- Easy to manage
- Supports future migration to schema-per-tenant or database-per-tenant

## Consequences
- All queries must filter by organization_id
- Tenant context propagated via request middleware
- Risk of accidental cross-tenant access mitigated by middleware and code review
