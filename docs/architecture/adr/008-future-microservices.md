# ADR-008: Future Microservices

## Status
Accepted

## Context
The system may need to scale beyond a single application.

## Decision
Design modules with clear bounded contexts and interfaces that can be extracted into separate services.

## Rationale
- Maintains modularity
- Future-proof architecture
- Allows independent scaling

## Consequences
- Modules must not share database tables directly
- Inter-module communication via events or APIs
- Clear ownership boundaries required
