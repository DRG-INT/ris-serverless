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

### Termux / Android Workaround

Prisma’s native engine binary does not run on Android/Termux. If you hit a schema engine JSON parse error there, use this workaround:

1. **Generate Prisma client only** — skip migration SQL execution:
```bash
npx prisma generate
```

2. **Apply the existing initial migration manually**:
```bash
psql "$DATABASE_URL" -f prisma/migrations/20260921191957_init/migration.sql
```

3. **Seed the database**:
```bash
npx tsx prisma/seed.ts
```

Alternatively, run `db:generate` and `db:seed` from a desktop machine, then connect the Android app to that Postgres instance.

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
