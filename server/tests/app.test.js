const request = require('supertest');
const app = require('../app');

describe('Basic server tests', () => {
  test('GET /user/login should return hello world json', async () => {
    const res = await request(app).get('/user/login');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ hello: 'world' });
  });
});
