# Repository Audit

## Stack
- **Backend**: TypeScript (Node.js), Express.js, Prisma, PostgreSQL
- **Frontend**: Vanilla JavaScript + Vite (no framework)
- **Auth**: JWT access/refresh tokens with bcrypt
- **Validation**: Zod
- **Testing**: Vitest + Supertest
- **Lint**: ESLint (backend TypeScript, frontend JavaScript)

## Architecture
Modular monolith with clearly separated bounded contexts:
- `/src/modules/*` for domain modules
- `/src/core/*` for framework concerns (auth, tenant, errors, router)
- `/frontend/src/views/*` for SPA page modules
- Express serves built frontend statically in production

## Database
Shared PostgreSQL with organization_id tenant key.
Strict tenant scoping enforced via middleware.

## Frontend
- SPA with hash-based routing
- Auth via `localStorage` tokens
- Dashboard fetches `GET /auth/me` for current user
- Dev proxy: Vite forwards `/api` to backend `:3000`
- Production: Express serves `frontend/dist/` as static files

## Testing
Unit tests for domain rules.
Integration tests for repositories.
API tests for critical endpoints.

## Status
Prototype in progress. Core CRUD modules implemented. Frontend functional for dashboard, members, and list views.
