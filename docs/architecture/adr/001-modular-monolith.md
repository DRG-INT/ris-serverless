# ADR-001: Modular Monolith

## Status
Accepted

## Context
We need to build a sports/recreation management platform that can evolve into a microservices architecture.

## Decision
Use a modular monolith architecture with clearly separated bounded contexts inside a single deployable application.

## Rationale
- Simpler to develop and deploy initially
- No premature microservice complexity
- Clear module boundaries allow future extraction
- Easier testing and debugging

## Consequences
- Single deployment unit
- Modules must communicate via well-defined interfaces
- Future services can be extracted by module boundaries
