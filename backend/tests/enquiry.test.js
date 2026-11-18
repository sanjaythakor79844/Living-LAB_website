import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('Enquiry API Test Suite', () => {
  const validPayload = {
    name: 'Dr. Rohan Deshmukh',
    mobile: '+91 98220 12345',
    email: 'rohan.deshmukh@wellnesscentre.in',
    organization: 'Apex Wellness Clinic',
    subject: 'Pod installation at Pune branch',
    message: 'We are interested in installing a Living Lab Pod at our clinic and would like more details on space and tiers.',
  };

  it('POST /api/enquiries should save enquiry with valid data', async () => {
    const res = await request(app)
      .post('/api/enquiries')
      .send(validPayload);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, validPayload.name);
    assert.equal(res.body.data.mobile, validPayload.mobile);
    assert.equal(res.body.data.email, validPayload.email);
    assert.equal(res.body.data.organization, validPayload.organization);
    assert.equal(res.body.data.subject, validPayload.subject);
    assert.equal(res.body.data.message, validPayload.message);
    assert.ok(res.body.data.id);
  });

  it('POST /api/enquiries should reject payload missing required fields', async () => {
    const incompletePayload = {
      name: 'Rohan',
      // missing mobile, email, subject, message
    };

    const res = await request(app)
      .post('/api/enquiries')
      .send(incompletePayload);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Validation failed');
    assert.ok(res.body.errors.length > 0);
  });

  it('POST /api/enquiries should reject invalid email format', async () => {
    const invalidEmail = {
      ...validPayload,
      email: 'not-an-email',
    };

    const res = await request(app)
      .post('/api/enquiries')
      .send(invalidEmail);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    const hasEmailError = res.body.errors.some((err) => err.field === 'email');
    assert.ok(hasEmailError);
  });

  it('GET /api/enquiries should retrieve saved enquiries', async () => {
    const res = await request(app).get('/api/enquiries');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });
});
