# ADR-003: Authentication

## Status
Accepted

## Context
Users need secure authentication with support for roles and permissions.

## Decision
Use JWT access tokens and refresh tokens with bcrypt password hashing.

## Rationale
- Stateless and scalable
- Standard approach for REST APIs
- Easy to implement and test

## Consequences
- Tokens must be stored securely on client
- Refresh token rotation required for security
- Future: OAuth, SSO, MFA, passkeys can be added
