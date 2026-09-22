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

1. Install system dependencies:
```bash
pkg update && pkg install -y git nodejs postgresql
```

2. Clone the repo and install dependencies:
```bash
git clone https://github.com/DRG-INT/ris-serverless.git
cd ris-serverless
npm install
cd frontend && npm install && cd ..
```

3. Create `.env` in the project root:
```bash
cat > .env << 'EOF'
NODE_ENV=development
APP_NAME="Recreation in Sport"
APP_URL=http://localhost:3000
PORT=3000

DATABASE_URL="postgresql://peter@localhost:5432/ris_serverless?schema=public"

JWT_SECRET=change-me-in-production-minimum-32-chars-long
JWT_ACCESS_TTL=3600
JWT_REFRESH_TTL=604800

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

MAIL_FROM=noreply@example.com
MAIL_DRIVER=log
EOF
```

4. Initialize local PostgreSQL (if using local DB):
```bash
initdb ~/postgres_data
pg_ctl -D ~/postgres_data -l ~/postgres.log start
```

5. Start the app:
```bash
npm start
```

### Termux / Android Known Issues

- **Prisma schema engine**: native binary does not run on Android. Skip `npm run db:generate` and apply the initial migration manually:
  ```bash
  psql "$DATABASE_URL" -f prisma/migrations/20260921191957_init/migration.sql
  npx tsx prisma/seed.ts
  ```
- **Missing global CLIs**: if `vite`, `tsx`, or `tsc` are not found, use `npx vite build`, `npx tsx src/server.ts`, or run `npm install` in the relevant folder.
- **Zod config errors**: ensure `.env` exists and contains `DATABASE_URL` and `JWT_SECRET`.

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
- GUI docs: `docs/gui/` (to be added)

## Testing

```bash
npm run test
```

## Scripts

- `npm run dev` - Start backend dev server
- `npm run build` - Build backend
- `npm run test` - Run tests
- `npm run lint` - Lint backend
- `npm run db:generate` - Generate Prisma migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio
- `npm run frontend:dev` - Start frontend dev server
- `npm run frontend:build` - Build frontend
- `npm run frontend:install` - Install frontend dependencies

## Frontend Notes

The frontend is a vanilla JavaScript + Vite application with no build-time transpilation.
