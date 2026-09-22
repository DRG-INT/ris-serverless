# Recreation in Sport - Serverless

API-first modular sports and recreation management platform built with Node.js, TypeScript, Express, and Prisma.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Start PostgreSQL (ensure it's running on localhost:5432)

4. Run migrations and seed:
```bash
npm run db:generate
npm run db:seed
```

5. Start the application:
```bash
npm run dev
```

The API is available at `http://localhost:3000/api/v1`.

## Demo Credentials

- `owner@example.test` / `password123`
- `admin@example.test` / `password123`
- `trainer@example.test` / `password123`
- `member@example.test` / `password123`

## API Documentation

See `docs/api/openapi.yaml` for the OpenAPI specification.

## Architecture

See `docs/architecture/adr/` for architectural decision records.

## Testing

```bash
npm run test
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run db:generate` - Generate Prisma migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio
