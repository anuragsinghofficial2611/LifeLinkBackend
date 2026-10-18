import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Admin } from '../src/models/Admin.model.js';

describe('Platform Statistics Endpoints', () => {
  const adminCredentials = {
    email: 'admin@lifelink.org',
    password: 'Admin@SecurePass123!'
  };

  it('admin accesses platform statistics', async () => {
    // 1. Create admin
    await Admin.create({
      name: 'Super Admin',
      email: adminCredentials.email,
      password: adminCredentials.password,
      role: 'admin'
    });

    // 2. Admin logs in
    const loginRes = await request(app)
      .post('/api/v1/admin/login')
      .send(adminCredentials);

    const token = loginRes.body.access_token;

    // 3. Get active blood requests stats
    const activeReqRes = await request(app)
      .get('/api/v1/platform-stats/active_blood_requests')
      .set('Authorization', `Bearer ${token}`);

    expect(activeReqRes.status).toBe(200);
    expect(activeReqRes.body).toHaveProperty('active_blood_requests');

    // 4. Get registered hospitals stats
    const regHospRes = await request(app)
      .get('/api/v1/platform-stats/registered_hospitals')
      .set('Authorization', `Bearer ${token}`);

    expect(regHospRes.status).toBe(200);
    expect(regHospRes.body).toHaveProperty('registered_hospitals');

    // 5. Get total donations stats
    const totalDonationsRes = await request(app)
      .get('/api/v1/platform-stats/total_donations')
      .set('Authorization', `Bearer ${token}`);

    expect(totalDonationsRes.status).toBe(200);
    expect(totalDonationsRes.body).toHaveProperty('total_donations');
  });
});
