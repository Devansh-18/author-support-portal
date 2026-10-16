import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Express Application Hermetic Integration Tests', () => {
  const testConfig = {
    port: 5001,
    nodeEnv: 'test',
    clientOrigin: 'http://localhost:5173'
  };

  const app = createApp(testConfig);

  it('GET /api/health - should return 200 OK with health status (Positive Case)', async () => {
    const res = await request(app).get('/api/health');

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'UP');
    assert.equal(res.body.service, 'author-support-backend');
    assert.ok(res.body.timestamp);
  });

  it('GET /api/non-existent-route - should return 404 Not Found error response (Negative Case)', async () => {
    const res = await request(app).get('/api/non-existent-route');

    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'NotFoundError');
    assert.ok(res.body.message.includes('/api/non-existent-route'));
  });
});
