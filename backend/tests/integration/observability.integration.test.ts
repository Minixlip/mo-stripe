import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';

describe('Observability surface', () => {
  it('returns a request id on health checks', async () => {
    const response = await request(app).get('/health');

    expect([200, 503]).toContain(response.status);
    expect(response.headers['x-request-id']).toEqual(expect.any(String));
    expect(response.body.requestId).toBe(response.headers['x-request-id']);
    expect(response.body.service).toBe('mo-stripe-api');
  });

  it('returns a request id on 404 responses', async () => {
    const response = await request(app).get('/missing-route');

    expect(response.status).toBe(404);
    expect(response.headers['x-request-id']).toEqual(expect.any(String));
    expect(response.body).toEqual({
      error: 'Route not found.',
      requestId: response.headers['x-request-id'],
    });
  });
});
