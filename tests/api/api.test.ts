import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { config } from '../../src/core/config.js';

const BASE_URL = `http://localhost:${config.PORT}`;

describe('API Health', () => {
  it('returns health status', async () => {
    const res = await request(BASE_URL).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('returns ready status', async () => {
    const res = await request(BASE_URL).get('/ready');
    expect([200, 503]).toContain(res.status);
  });
});

describe('Auth API', () => {
  it('registers a new organization', async () => {
    const uniqueEmail = `test-${Date.now()}@example.test`;
    const res = await request(BASE_URL)
      .post('/api/v1/auth/register')
      .send({ email: uniqueEmail, password: 'password123', firstName: 'Test', lastName: 'User', organizationName: 'Test Org' });
    
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(uniqueEmail);
  });
});
