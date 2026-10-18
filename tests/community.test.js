import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Community & Chat Endpoints', () => {
  const userPayload = {
    name: 'Alice Community',
    email: 'alice@example.com',
    blood_group: 'B+',
    age: 22,
    sex: 'Female',
    password: 'Password@1234!'
  };

  it('handles community post creation and retrieval', async () => {
    // 1. Register & login user
    await request(app).post('/api/v1/register/').send(userPayload);
    const loginRes = await request(app).post('/api/v1/login/').send({
      email: userPayload.email,
      password: userPayload.password
    });
    const token = loginRes.body.access_token;

    // 2. User creates a community post
    const postRes = await request(app)
      .post('/api/v1/community/')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Proud to have donated blood today! Save lives!' });

    expect(postRes.status).toBe(201);
    expect(postRes.body).toHaveProperty('id');
    expect(postRes.body.user_name).toBe(userPayload.name);
    expect(postRes.body.message).toContain('Proud to have donated blood');

    // 3. Anyone can read community posts without token
    const listRes = await request(app).get('/api/v1/community/');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/chat/ - responds to blood donation inquiries', async () => {
    const chatRes = await request(app)
      .post('/api/v1/chat/')
      .send({
        message: 'Who can donate blood?'
      });

    expect(chatRes.status).toBe(200);
    expect(chatRes.body).toHaveProperty('reply');
    expect(chatRes.body.reply.length).toBeGreaterThan(10);
  });
});
