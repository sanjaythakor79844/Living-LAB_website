import test from 'node:test';
import assert from 'node:assert/strict';
import { createEnquirySchema } from '../backend/src/validators/enquiry.validator.js';

test('Enquiry validation - accepts valid data with all 6 required fields', () => {
  const validData = {
    name: 'Dr. Ananya Sharma',
    mobile: '+91 98220 12345',
    email: 'ananya.sharma@aims-hospital.in',
    organization: 'AIMS Wellness Institute',
    subject: 'Pod deployment enquiry for Pune',
    message: 'We are evaluating the Living Lab Pod for our preventive healthcare wing.',
  };

  const parsed = createEnquirySchema.safeParse(validData);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.name, 'Dr. Ananya Sharma');
  assert.equal(parsed.data.mobile, '+91 98220 12345');
  assert.equal(parsed.data.email, 'ananya.sharma@aims-hospital.in');
  assert.equal(parsed.data.organization, 'AIMS Wellness Institute');
  assert.equal(parsed.data.subject, 'Pod deployment enquiry for Pune');
  assert.equal(parsed.data.message, validData.message);
});

test('Enquiry validation - rejects when required fields are missing', () => {
  const missingFields = {
    name: 'Ananya',
    email: 'ananya@example.com',
    // missing mobile, subject, message
  };

  const parsed = createEnquirySchema.safeParse(missingFields);
  assert.equal(parsed.success, false);
  const fields = parsed.error.issues.map((i) => i.path[0]);
  assert.ok(fields.includes('mobile'));
  assert.ok(fields.includes('subject'));
  assert.ok(fields.includes('message'));
});

test('Enquiry validation - organization is optional and defaults cleanly', () => {
  const dataWithoutOrg = {
    name: 'Suresh Patil',
    mobile: '9822099999',
    email: 'suresh@gmail.com',
    subject: 'General enquiry',
    message: 'Looking forward to learning more about the Liv pod.',
  };

  const parsed = createEnquirySchema.safeParse(dataWithoutOrg);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.organization, '');
});
