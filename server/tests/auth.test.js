const request = require('supertest');
const app = require('../app');
const db = require('../database/database');

describe('Auth flow integration tests', () => {
  const shortSuffix = String(Date.now()).slice(-6);
  let testUser = {
    name: 'Test User',
    username: `tu_${shortSuffix}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };

  beforeAll(async () => {
    
    await db.connectDB();
  });

  afterAll(async () => {
    const User = require('../models/user');
    await User.deleteOne({ email: testUser.email });
  await db.disconnectDB();
  });

  test('signup should create a new user and return 201', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send(testUser)
      .set('Accept', 'application/json');
  expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('email', testUser.email);
    expect(res.body.data).not.toHaveProperty('password');
  });

  test('signin should authenticate the user and return token', async () => {
    const res = await request(app)
      .post('/user/signin')
      .send({ email: testUser.email, password: testUser.password })
      .set('Accept', 'application/json');
  expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user).toHaveProperty('email', testUser.email);
  });
});
