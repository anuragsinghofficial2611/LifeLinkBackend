import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Blood Requests Endpoints', () => {
  const userPayload = {
    name: 'Jane Patient',
    email: 'jane@example.com',
    blood_group: 'A+',
    age: 25,
    sex: 'Female',
    password: 'Password@1234!'
  };

  const hospitalPayload = {
    name: 'City General Hospital',
    type: 'Government',
    phone: '555-0199',
    email: 'hospital@citygeneral.org',
    city: 'Metropolis',
    zipcode: '10001',
    state: 'NY',
    address: '123 Health Ave',
    district: 'Central',
    longitude: -74.006,
    latitude: 40.7128,
    geohash_64_bits: 'dr5regw3pg7x',
    password: 'Password@1234!'
  };

  it('allows user to create blood request and hospital to read/update it', async () => {
    // 1. Register and login User
    await request(app).post('/api/v1/register/').send(userPayload);
    const userLogin = await request(app).post('/api/v1/login/').send({
      email: userPayload.email,
      password: userPayload.password
    });
    const userToken = userLogin.body.access_token;

    // 2. Register Hospital
    const hospRegister = await request(app)
      .post('/api/v1/hospitals/')
      .send(hospitalPayload);
    const hospitalToken = hospRegister.body.access_token;

    // 3. User creates Blood Request
    const requestPayload = {
      patient_name: 'Mark Doe',
      guardian_name: 'Jane Patient',
      phone: '555-1234',
      additional_phone: null,
      blood_group: 'A+',
      age: 30,
      sex: 'Male',
      quantity: '450',
      longitude: -74.006,
      latitude: 40.7128,
      geohash_64_bits: 'dr5regw3pg7x'
    };

    const createRes = await request(app)
      .post('/api/v1/blood-requests/')
      .set('Authorization', `Bearer ${userToken}`)
      .send(requestPayload);

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('id');
    expect(createRes.body.patient_name).toBe('Mark Doe');
    expect(createRes.body.status).toBe('active');

    const requestId = createRes.body.id;

    // 4. Hospital gets blood requests list
    const listRes = await request(app)
      .get('/api/v1/blood-requests/')
      .set('Authorization', `Bearer ${hospitalToken}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);

    // 5. Hospital gets specific blood request by ID
    const getRes = await request(app)
      .get(`/api/v1/blood-requests/${requestId}`)
      .set('Authorization', `Bearer ${hospitalToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(requestId);

    // 6. Hospital updates blood request status
    const updateRes = await request(app)
      .put(`/api/v1/blood-requests/${requestId}`)
      .set('Authorization', `Bearer ${hospitalToken}`)
      .send({ status: 'completed' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe('completed');

    // 7. Hospital deletes blood request
    const deleteRes = await request(app)
      .delete(`/api/v1/blood-requests/${requestId}`)
      .set('Authorization', `Bearer ${hospitalToken}`);

    expect(deleteRes.status).toBe(200);
  });
});
