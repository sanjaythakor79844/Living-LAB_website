import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('The Living Lab - Backend API Test Suite', () => {
  describe('GET /', () => {
    it('should return 200 and welcome payload', async () => {
      const res = await request(app).get('/');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.name, 'The Living Lab API');
      assert.equal(res.body.data.healthCheck, '/api/health');
    });

    it('should include security headers from Helmet', async () => {
      const res = await request(app).get('/');

      assert.equal(res.headers['x-content-type-options'], 'nosniff');
      assert.ok(res.headers['x-dns-prefetch-control']);
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 and operational status', async () => {
      const res = await request(app).get('/api/health');

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.message, 'System operational');
      assert.ok(res.body.data);
    });

    it('should report server status and uptime', async () => {
      const res = await request(app).get('/api/health');
      const { server } = res.body.data;

      assert.ok(server);
      assert.equal(server.status, 'healthy');
      assert.equal(typeof server.uptimeSeconds, 'number');
      assert.ok(server.uptimeSeconds >= 0);
      assert.ok(server.memoryUsage);
      assert.ok(server.nodeVersion);
    });

    it('should report API status', async () => {
      const res = await request(app).get('/api/health');
      const { api } = res.body.data;

      assert.ok(api);
      assert.equal(api.status, 'active');
      assert.equal(api.version, '1.0.0');
      assert.equal(api.service, 'The Living Lab API');
    });

    it('should honestly report database status', async () => {
      const res = await request(app).get('/api/health');
      const { database } = res.body.data;

      assert.ok(database);
      assert.equal(typeof database.configured, 'boolean');
      assert.ok(['connected', 'connecting', 'disconnected', 'unconfigured'].includes(database.status));
    });

    it('should return valid ISO timestamp', async () => {
      const res = await request(app).get('/api/health');
      const { timestamp } = res.body.data;

      assert.ok(timestamp);
      const parsedDate = new Date(timestamp);
      assert.ok(!isNaN(parsedDate.getTime()));
    });
  });

  describe('404 Not Found Handling', () => {
    it('should return 404 for unmapped routes', async () => {
      const res = await request(app).get('/api/does-not-exist');

      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.match(res.body.message, /Route not found/);
    });
  });
});
