import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Admin } from '../src/models/Admin.model.js';

describe('Hospital & Admin Verification Endpoints', () => {
  const adminCredentials = {
    email: 'admin@lifelink.org',
    password: 'Admin@SecurePass123!'
  };

  const hospitalPayload = {
    name: 'Metropolitan Medical Center',
    type: 'Private',
    phone: '555-9876',
    email: 'contact@metropolitan.org',
    city: 'Metropolis',
    zipcode: '10002',
    state: 'NY',
    address: '456 Care Blvd',
    district: 'North',
    longitude: -73.985,
    latitude: 40.748,
    geohash_64_bits: 'dr5ru6j2s9z1',
    password: 'Password@1234!'
  };

  it('admin logs in, lists pending hospitals, and verifies hospital', async () => {
    // 1. Ensure admin exists
    await Admin.create({
      name: 'Super Admin',
      email: adminCredentials.email,
      password: adminCredentials.password,
      role: 'admin'
    });

    // 2. Admin logs in
    const adminLoginRes = await request(app)
      .post('/api/v1/admin/login')
      .send(adminCredentials);

    expect(adminLoginRes.status).toBe(200);
    expect(adminLoginRes.body).toHaveProperty('access_token');
    const adminToken = adminLoginRes.body.access_token;

    // 3. Register a new hospital (unverified by default)
    const hospRegRes = await request(app)
      .post('/api/v1/hospitals/')
      .send(hospitalPayload);

    expect(hospRegRes.status).toBe(201);
    const hospitalId = hospRegRes.body.hospital.hospital_id;

    // 4. Admin checks pending hospitals
    const pendingRes = await request(app)
      .get('/api/v1/admin/hospitals/pending')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(pendingRes.status).toBe(200);
    expect(Array.isArray(pendingRes.body)).toBe(true);
    expect(pendingRes.body.some((h) => h.id === hospitalId)).toBe(true);

    // 5. Admin verifies hospital
    const verifyRes = await request(app)
      .put(`/api/v1/admin/hospitals/${hospitalId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.message).toContain('verified successfully');

    // 6. Hospital should no longer be pending
    const afterPendingRes = await request(app)
      .get('/api/v1/admin/hospitals/pending')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(afterPendingRes.body.some((h) => h.id === hospitalId)).toBe(false);
  });
});
