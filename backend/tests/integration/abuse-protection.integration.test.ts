import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';

describe('Abuse protection', () => {
  it('rate limits repeated failed login attempts for the same identity key', async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await request(app).post('/login').send({
        email: 'rate-limit@example.com',
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
    }

    const limitedResponse = await request(app).post('/login').send({
      email: 'rate-limit@example.com',
      password: 'WrongPassword123!',
    });

    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.headers['x-request-id']).toEqual(expect.any(String));
    expect(limitedResponse.body).toEqual({
      error: 'Too many login attempts. Please wait before retrying.',
      retryAfterSeconds: expect.any(Number),
      requestId: limitedResponse.headers['x-request-id'],
    });
  });
});
