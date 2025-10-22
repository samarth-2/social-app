const request = require('supertest');
const app = require('../app');
const db = require('../database/database');

describe('Post and Comment integration tests', () => {
  let testUser = null;
  let token = null;
  let createdPost = null;
  let createdComment = null;

  beforeAll(async () => {
    await db.connectDB();

    const unique = String(Date.now()).slice(-6);
    testUser = {
      name: 'Post Tester',
      username: `pt_${unique}`,
      email: `pt_${Date.now()}@example.com`,
      password: 'password123'
    };

  await request(app).post('/user/signup').send(testUser);
  const { Role } = require('../models/role');
  const roleDoc = await Role.create({ name: 'test_role', permission_level: '*' });
  const User = require('../models/user');
  await User.findOneAndUpdate({ email: testUser.email }, { role: roleDoc._id });
  const res = await request(app).post('/user/signin').send({ email: testUser.email, password: testUser.password });
  token = res.body.data.token;
  });

  afterAll(async () => {
    const Post = require('../models/post');
    const Comment = require('../models/comment');
    const User = require('../models/user');
  const { Role } = require('../models/role');

    if (createdComment && createdComment._id) {
      await Comment.deleteOne({ _id: createdComment._id });
    }
    if (createdPost && createdPost._id) {
      await Post.deleteOne({ _id: createdPost._id });
    }
    if (testUser && testUser.email) {
      await User.deleteOne({ email: testUser.email });
    }
  // remove role
  await Role.deleteOne({ name: 'test_role' });

    await db.disconnectDB();
  });

  test('create post should succeed with auth token', async () => {
    const postPayload = {
      title: 'Integration Test Post',
      content: 'This is a test post created by Jest',
      imageUrl: 'http://example.com/image.jpg'
    };

    const res = await request(app)
      .post('/post/create-post')
      .set('Authorization', `Bearer ${token}`)
      .send(postPayload);

  expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    createdPost = res.body.data;
    expect(createdPost).toHaveProperty('title', postPayload.title);
  });

  test('create comment on post should succeed with auth token', async () => {
    const commentPayload = {
      text: 'Nice post!',
      postId: createdPost._id
    };

    const res = await request(app)
      .post('/comment/create')
      .set('Authorization', `Bearer ${token}`)
      .send(commentPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    createdComment = res.body.data;
    expect(createdComment).toHaveProperty('text', commentPayload.text);
  });

/////////////////////////////////////////////////////
  
test('create post should fail without auth', async () => {
    const postPayload = {
    title: 'No Auth Post',
    content: 'Missing auth header should fail',
    imageUrl: 'http://example.com/image.jpg'
    };

    const res = await request(app)
    .post('/post/create-post')
    .send(postPayload);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
});

  test('create post should fail with invalid token', async () => {
    const postPayload = {
      title: 'Invalid Token Post',
      content: 'Invalid token should fail',
      imageUrl: 'http://example.com/image.jpg'
    };

    const res = await request(app)
      .post('/post/create-post')
      .set('Authorization', `Bearer invalid.token.here`)
      .send(postPayload);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('create post should fail with missing fields', async () => {
    const postPayload = {
      title: 'Bad Post',
      content: 'Missing imageUrl'
    };

    const res = await request(app)
      .post('/post/create-post')
      .set('Authorization', `Bearer ${token}`)
      .send(postPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('create comment should fail without auth', async () => {
    const commentPayload = {
      text: 'Should fail',
      postId: createdPost._id
    };

    const res = await request(app)
      .post('/comment/create')
      .send(commentPayload);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
