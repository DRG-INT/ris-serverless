# Recreation in Sport

API-first modular sports and recreation management platform.

## Repository

- **Backend/API**: Node.js, Express, Prisma, PostgreSQL
- **Frontend/GUI**: React, TypeScript, Vite, TanStack Query, Tailwind CSS

## Quick Start

### Backend

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Start PostgreSQL and run migrations:
```bash
npm run db:generate
npm run db:seed
```

4. Start the API:
```bash
npm run dev
```

API available at `http://localhost:3000/api/v1`.

### Frontend

1. Install dependencies:
```bash
cd frontend && npm install
```

2. Start the GUI:
```bash
cd frontend && npm run dev
```

Frontend available at `http://localhost:5173`.

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
