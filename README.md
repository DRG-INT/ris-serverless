# Recreation in Sport

API-first modular sports and recreation management platform.

## Repository

- **Backend/API**: Node.js, Express, Prisma, PostgreSQL
- **Frontend/GUI**: Vanilla JavaScript + Vite

## Quick Start

### Backend + Frontend (merged)

This project serves the built frontend from the Express backend. In development, the frontend dev server proxies API requests to the backend.

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend && npm install && cd ..
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Start PostgreSQL and run migrations:
```bash
npm run db:generate
npm run db:seed
```

5. Start both servers in development:
```bash
npm run dev            # Backend on :3000
cd frontend && npm run dev   # Frontend on :5173, proxies /api to backend
```

Frontend available at `http://localhost:5173`, API at `http://localhost:3000/api/v1`.

### Production Build

Build and serve from one process:
```bash
npm run build          # Builds frontend, then compiles backend TypeScript
npm start              # Serves API + static frontend from :3000
```

### Termux / Android Setup

**Note**: Prisma’s native query engine does **not** run on Android/Termux. The recommended workflow is to run the backend on a desktop/server with PostgreSQL, then access it from Termux. If you must run locally on Termux, use a remote Postgres provider and skip local Prisma migrations.

#### Option A: Desktop development (recommended)

1. Clone and install:
```bash
git clone https://github.com/DRG-INT/ris-serverless.git
cd ris-serverless
npm install
cd frontend && npm install && cd ..
```

2. Create `.env` from the example:
```bash
cp .env.example .env
```

3. Start PostgreSQL locally and run migrations:
```bash
npm run db:generate
npm run db:seed
```

4. Start the app:
```bash
npm run dev            # Backend on :3000
cd frontend && npm run dev   # Frontend on :5173
```

#### Option B: Termux with remote PostgreSQL

1. Install dependencies:
```bash
pkg update && pkg install -y git nodejs
```

2. Clone and install:
```bash
git clone https://github.com/DRG-INT/ris-serverless.git
cd ris-serverless
npm install
cd frontend && npm install && cd ..
```

3. Create `.env` in the project root:
```bash
cat > .env << 'ENVEOF'
NODE_ENV=development
APP_NAME="Recreation in Sport"
APP_URL=http://localhost:3000
PORT=3000

DATABASE_URL="postgresql://YOUR_USER:YOUR_PASS@YOUR_HOST:5432/ris_serverless?schema=public"

JWT_SECRET=change-me-in-production-minimum-32-chars-long
JWT_ACCESS_TTL=3600
JWT_REFRESH_TTL=604800

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

MAIL_FROM=noreply@example.com
MAIL_DRIVER=log
ENVEOF
```

Replace `YOUR_USER`, `YOUR_PASS`, and `YOUR_HOST` with your remote Postgres credentials.

4. **Skip Prisma migrations on Termux** — they require the native query engine. Instead:
   - Run `npm run db:generate && npm run db:seed` from a desktop machine against the same remote database, OR
   - Apply the initial migration manually from Termux:
     ```bash
     curl -fsSL https://raw.githubusercontent.com/DRG-INT/ris-serverless/main/prisma/migrations/20260921191957_init/migration.sql -o /tmp/init.sql
     psql "$DATABASE_URL" -f /tmp/init.sql
     npx tsx prisma/seed.ts
     ```

5. Start the app:
```bash
npm start
```

#### Termux Known Issues

- **Prisma native engine**: incompatible with Android. If you see `P5010` or `Unable to require libquery_engine...`, the backend cannot run Prisma on Termux. Use one of these paths:
  - Run the backend on a desktop/server/VPS, then access it from Termux via the frontend or API.
  - Replace Prisma with a pure-JS PostgreSQL client (requires code changes).
- **Missing global CLIs**: if `vite`, `tsx`, or `tsc` are not found, use `npx vite build`, `npx tsx src/server.ts`, or run `npm install` in the relevant folder.
- **Zod config errors**: ensure `.env` exists and contains `DATABASE_URL` and `JWT_SECRET`.
- **`npm run build` fails**: on Termux, `tsc` may be missing. Use `npm start` instead, which builds the frontend and runs the backend via `npx tsx`.

## Demo Credentials

- `owner@example.test` / `password123`
- `admin@example.test` / `password123`
- `trainer@example.test` / `password123`
- `member@example.test` / `password123`

## Documentation

- API: `docs/api/openapi.yaml`
- Architecture: `docs/architecture/adr/`
- Domain model: `docs/product/domain-model.md`
- Metamodel: `docs/metamodel/product-model.json`
- GUI docs: `docs/gui/`
- Development setup: `docs/development/setup.md`
- Testing: `docs/development/testing.md`
- Repository audit: `docs/architecture/repository-audit.md`

## Testing

```bash
npm run test
```

## Scripts

- `npm run dev` - Start backend dev server with tsx watch
- `npm run build` - Build frontend with Vite, then compile backend TypeScript
- `npm run start` - Build frontend and run backend via tsx (no dist/ needed)
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint backend TypeScript
- `npm run db:generate` - Generate Prisma migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio
- `npm run frontend:dev` - Start frontend dev server with Vite
- `npm run frontend:build` - Build frontend for production
- `npm run frontend:install` - Install frontend dependencies

## Frontend Notes

- **Stack**: Vanilla JavaScript + Vite (no React, no TypeScript transpilation in frontend)
- **Structure**: Modular files in `frontend/src/` — `router.js`, `api.js`, `views/dashboard.js`, etc.
- **Routing**: Hash-based SPA routing
- **Auth**: `localStorage` tokens; dashboard fetches `GET /auth/me`
- **Dev**: Vite proxies `/api` to backend `:3000`
- **Prod**: Express serves `frontend/dist/` statically
- **Lint**: `cd frontend && npm run lint`

## Backend Notes

- **Stack**: TypeScript, Express, Prisma, PostgreSQL
- **Auth**: JWT access + refresh tokens, bcrypt hashing
- **Multi-tenancy**: `tenantMiddleware` sets `req.tenant` from Bearer token
- **Modules**: 20+ bounded contexts under `src/modules/*`
- **Endpoints**: RESTful API under `/api/v1/*`
