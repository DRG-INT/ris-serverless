# Testing Guide

## Test Types

### Unit Tests
Test individual functions and classes in isolation.

### Integration Tests
Test database repositories and service interactions.

### API Tests
Test HTTP endpoints end-to-end.

## Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- tests/integration/database.test.ts
```

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';

describe('User Service', () => {
  it('hashes password', async () => {
    const hash = await hashPassword('password123');
    expect(hash).not.toBe('password123');
  });
});
```

### Integration Test Example
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../../src/core/database.js';

describe('Member Repository', () => {
  it('creates member', async () => {
    const member = await prisma.member.create({
      data: { organizationId: '...', firstName: 'Test', lastName: 'User', email: 'test@example.com' },
    });
    expect(member.id).toBeDefined();
  });
});
```

### API Test Example
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('Members API', () => {
  it('lists members', async () => {
    const res = await request(app)
      .get('/api/v1/members')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});
```

## Test Coverage

Current coverage:
- Database connection: 100%
- API health endpoints: 100%
- API auth endpoints: 100%

Target coverage: 80%+ for production readiness.
