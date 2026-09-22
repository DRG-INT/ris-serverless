# Development Setup

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DRG-INT/ris-serverless.git
cd ris-serverless
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend && npm install && cd ..
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Start PostgreSQL:
```bash
# Using Homebrew on macOS
brew services start postgresql@15

# Or using Docker
docker compose up -d postgres
```

6. Create database:
```bash
createdb ris_serverless
```

7. Run migrations:
```bash
npm run db:generate
```

8. Seed database:
```bash
npm run db:seed
```

9. Start development servers:
```bash
npm run dev            # Backend on :3000
cd frontend && npm run dev   # Frontend on :5173, proxies /api to backend
```

The API is available at `http://localhost:3000/api/v1`.
The frontend is available at `http://localhost:5173`.

## Production Build

Build and serve from one process:
```bash
npm run build          # Builds frontend, then compiles backend TypeScript
npm start              # Serves API + static frontend from :3000
```

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── main.js           # Entry point
│   │   ├── router.js         # Hash-based routing
│   │   ├── api.js            # Fetch wrapper + token handling
│   │   ├── utils.js          # DOM helpers
│   │   ├── style.css         # Global styles
│   │   └── views/
│   │       ├── login.js      # Login view
│   │       ├── register.js   # Registration view
│   │       └── dashboard.js  # Dashboard shell + all pages
│   ├── index.html            # SPA shell
│   ├── vite.config.ts        # Vite config with API proxy
│   └── package.json
├── src/
│   ├── core/                  # Core framework code
│   │   ├── config.ts         # Configuration management
│   │   ├── database.ts       # Prisma client
│   │   ├── errors.ts         # Error handling
│   │   ├── router.ts         # API router
│   │   ├── tenant.ts         # Multi-tenancy middleware
│   │   └── auth.ts           # Authentication logic
│   ├── modules/              # Domain modules
│   │   ├── identity/         # Authentication and users
│   │   ├── organizations/    # Organization management
│   │   ├── members/          # Member management
│   │   ├── bookings/         # Booking engine
│   │   ├── memberships/      # Membership management
│   │   ├── scheduling/       # Session scheduling
│   │   ├── payments/         # Payments
│   │   ├── reports/          # Reports
│   │   └── ...               # Other bounded contexts
│   └── server.ts             # Express entry point + static frontend serving
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # SQL migrations
│   └── seed.ts               # Seed data
├── tests/
│   ├── api/                   # API integration tests
│   └── integration/           # Database integration tests
├── docs/
│   ├── architecture/adr/      # Architecture decision records
│   ├── gui/                   # Frontend documentation
│   ├── product/               # Product docs
│   └── development/           # Developer docs
├── package.json
├── tsconfig.json
├── vite.config.ts             # Root-level Vite config if needed
└── README.md
```

## Frontend Notes

- **Stack**: Vanilla JavaScript + Vite (no React, no TypeScript transpilation in frontend)
- **Routing**: Hash-based SPA routing (`#/login`, `#/dashboard`, `#/members`, etc.)
- **State**: `localStorage` for tokens, in-memory for UI state
- **Auth flow**: Login → store `accessToken` + `refreshToken` → dashboard calls `GET /auth/me` → protected routes require `Authorization: Bearer` header
- **API client**: `frontend/src/api.js` wraps `fetch` with auth headers, 401 redirect, and error parsing
- **Lint**: `npm run lint` in `frontend/` runs ESLint on `src/**/*.js`

## Termux / Android Notes

Prisma’s native query engine does not run on Android/Termux. For development on Termux, use a remote PostgreSQL provider and run the backend on a desktop/server instead of locally. See README.md for details.
