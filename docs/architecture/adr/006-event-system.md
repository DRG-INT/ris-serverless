# ADR-006: Event System

## Status
Accepted

## Context
The platform needs an internal event system for automation and decoupled communication.

## Decision
Use an internal in-memory EventBus for domain events. No external message broker required initially.

## Rationale
- Simple to implement and test
- No infrastructure overhead
- Can be replaced with Kafka/RabbitMQ when needed

## Consequences
- Events are lost on restart
- Not suitable for distributed systems
- Future: can swap to Redis pub/sub or Kafka
