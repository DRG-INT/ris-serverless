# Development Setup

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RINSport_serverless
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Start PostgreSQL:
```bash
# Using Homebrew on macOS
brew services start postgresql@15

# Or using Docker
docker compose up -d postgres
```

5. Create database:
```bash
createdb ris_serverless
```

6. Run migrations:
```bash
npm run db:generate
```

7. Seed database:
```bash
npm run db:seed
```

8. Start development server:
```bash
npm run dev
```

The API is now available at `http://localhost:3000/api/v1`.

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npm run analyse
```

## Project Structure

```
src/
├── core/                    # Core framework code
│   ├── config.ts           # Configuration management
│   ├── database.ts         # Prisma client
│   ├── errors.ts           # Error handling
│   ├── router.ts           # API router
│   ├── tenant.ts           # Multi-tenancy middleware
│   └── ...
├── modules/                # Domain modules
│   ├── identity/           # Authentication and users
│   ├── organizations/      # Organization management
│   ├── members/            # Member management
│   ├── bookings/           # Booking engine
│   ├── memberships/        # Membership management
│   └── ...
└── server.ts               # Application entry point

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data

docs/
├── api/
│   └── openapi.yaml        # API specification
├── architecture/
│   └── adr/                 # Architecture decision records
├── metamodel/
│   ├── product-model.json  # Product metamodel
│   └── product-model.schema.json
└── product/
    └── domain-model.md     # Domain documentation
```
