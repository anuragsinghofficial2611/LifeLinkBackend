import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.model.js';

describe('Auth & User Endpoints', () => {
  const validUserPayload = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1234567890',
    blood_group: 'O+',
    age: 28,
    sex: 'Male',
    password: 'Password@1234!'
  };

  it('POST /api/v1/register/ - successfully registers a user', async () => {
    const res = await request(app)
      .post('/api/v1/register/')
      .send(validUserPayload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(validUserPayload.email);
    expect(res.body.name).toBe(validUserPayload.name);
    expect(res.body.blood_group).toBe(validUserPayload.blood_group);
    expect(res.body).not.toHaveProperty('password');

    // Verify password is encrypted in database
    const dbUser = await User.findOne({ email: validUserPayload.email });
    expect(dbUser).not.toBeNull();
    expect(dbUser.password).not.toBe(validUserPayload.password);
    expect(dbUser.password.startsWith('$2')).toBe(true);
  });

  it('POST /api/v1/register/ - rejects duplicate email registration', async () => {
    await request(app).post('/api/v1/register/').send(validUserPayload);

    const duplicateRes = await request(app)
      .post('/api/v1/register/')
      .send(validUserPayload);

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
  });

  it('POST /api/v1/register/ - rejects weak password (< 12 chars)', async () => {
    const invalidPayload = {
      ...validUserPayload,
      email: 'weakpass@example.com',
      password: 'weak'
    };

    const res = await request(app)
      .post('/api/v1/register/')
      .send(invalidPayload);

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('detail');
  });

  it('POST /api/v1/login/ - logs in registered user with token', async () => {
    await request(app).post('/api/v1/register/').send(validUserPayload);

    const res = await request(app)
      .post('/api/v1/login/')
      .send({
        email: validUserPayload.email,
        password: validUserPayload.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token');
    expect(res.body.token_type).toBe('bearer');
    expect(res.body.user.email).toBe(validUserPayload.email);
  });

  it('GET /api/v1/users/me - protects user profile without token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/users/me - returns profile with valid Bearer token', async () => {
    await request(app).post('/api/v1/register/').send(validUserPayload);

    const loginRes = await request(app)
      .post('/api/v1/login/')
      .send({
        email: validUserPayload.email,
        password: validUserPayload.password
      });

    const token = loginRes.body.access_token;

    const profileRes = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.email).toBe(validUserPayload.email);
    expect(profileRes.body.name).toBe(validUserPayload.name);
  });
});
