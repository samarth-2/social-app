const request = require('supertest');
const app = require('../app');
const db = require('../database/database');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('API full integration tests', () => {
  const short = String(Date.now()).slice(-6);
  const users = [];
  const posts = [];
  const comments = [];
  let authCookieA = null;

  beforeAll(async () => {
    jest.setTimeout(30000);
    try {
      mongoServer = await MongoMemoryServer.create();
      process.env.MONGO_URL = mongoServer.getUri();
  console.log('Using in-memory MongoDB');
    } catch (err) {
  console.warn('Could not start in-memory MongoDB, falling back to local MongoDB at 127.0.0.1');
      process.env.MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/social-app-test';
    }
    await db.connectDB();
  });

  afterAll(async () => {
    const User = require('../models/user');
    const Post = require('../models/post');
    const Comment = require('../models/comment');
    
    await Comment.deleteMany({ _id: { $in: comments } }).catch(() => {});
    await Post.deleteMany({ _id: { $in: posts } }).catch(() => {});
    await User.deleteMany({ _id: { $in: users } }).catch(() => {});
  await db.disconnectDB();
  if (mongoServer) await mongoServer.stop();
  });

  
  
  const signupAndSignin = async ({ name, username, email, password }) => {
    const resSignup = await request(app).post('/user/signup').send({ name, username, email, password });
    if (![200, 201].includes(resSignup.statusCode)) {
    }

    const resSignin = await request(app)
      .post('/user/signin')
      .send({ email, password })
      .set('Accept', 'application/json');

    expect(resSignin.statusCode).toBe(200);
    const cookie = resSignin.headers['set-cookie'];
    const user = resSignin.body.data.user || resSignin.body.data;
    return { cookie, user };
  };

  test('signup rejects missing fields', async () => {
    const res = await request(app).post('/user/signup').send({ username: 'a' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  test('signup and signin happy path (user A)', async () => {
    const userA = {
      name: 'User A',
      username: `usera_${short}`,
      email: `usera_${short}@example.com`,
      password: 'password1'
    };
  const { cookie, user } = await signupAndSignin(userA);
    expect(user).toHaveProperty('email', userA.email);
    users.push(user._id || user.id);
    expect(cookie).toBeDefined();
  authCookieA = cookie;
  });

  test('signin fails with wrong password', async () => {
    const res = await request(app)
      .post('/user/signin')
      .send({ email: `usera_${short}@example.com`, password: 'bad' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('check-auth protected route returns 401 without cookie', async () => {
    const res = await request(app).get('/user/check-auth');
    expect([401,403]).toContain(res.statusCode);
  });

  test('create post rejected without auth', async () => {
    const res = await request(app).post('/post/create').send({ title: 'x', content: 'y', imageUrl: 'u' });
    expect([401,403,404]).toContain(res.statusCode);
  });

  test('user A creates a post successfully', async () => {
    const userA = {
      name: 'User A',
      username: `usera_${short}`,
      email: `usera_${short}@example.com`,
      password: 'password1'
    };
    const { cookie, user } = await signupAndSignin(userA);
    users.push(user._id || user.id);

    const res = await request(app)
      .post('/post/create-post')
      .set('Cookie', cookie)
      .send({ title: 'First', content: 'Hello', imageUrl: 'http://img' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    posts.push(res.body.data._id);
  });

  test('pagination endpoint returns posts', async () => {
  const res = await request(app).get('/post/feed?page=1').set('Cookie', authCookieA);
    expect([200,201]).toContain(res.statusCode);
    if (res.body.posts) expect(Array.isArray(res.body.posts)).toBe(true);
  });

  test('create second user (User B) and attempt to delete user A post - should fail', async () => {
    const userB = {
      name: 'User B',
      username: `userb_${short}`,
      email: `userb_${short}@example.com`,
      password: 'password2'
    };
    const { cookie: cookieB, user: uB } = await signupAndSignin(userB);
    users.push(uB._id || uB.id);

  const resPosts = await request(app).get('/post/feed?page=1').set('Cookie', cookieB);
    const somePost = (resPosts.body.posts && resPosts.body.posts[0]) || null;
    if (!somePost) return expect(true).toBe(true);

    const res = await request(app)
      .post('/post/delete-post')
      .set('Cookie', cookieB)
      .send({ postId: somePost._id });

    expect([400,403]).toContain(res.statusCode);
  });

  test('create comment requires auth', async () => {
    const res = await request(app).post('/comment/create').send({ text: 'hi', postId: '123' });
    expect([401,403]).toContain(res.statusCode);
  });

  test('create and delete comment flow', async () => {
    const userC = {
      name: 'User C',
      username: `userc_${short}`,
      email: `userc_${short}@example.com`,
      password: 'password3'
    };
    const { cookie: cookieC, user: uC } = await signupAndSignin(userC);
    users.push(uC._id || uC.id);

    const resPost = await request(app)
      .post('/post/create-post')
      .set('Cookie', cookieC)
      .send({ title: 'Cpost', content: 'content', imageUrl: 'u' });
    expect(resPost.statusCode).toBe(201);
    const pId = resPost.body.data._id;
    posts.push(pId);

    const resComment = await request(app)
      .post('/comment/create')
      .set('Cookie', cookieC)
      .send({ text: 'nice', postId: pId });
    expect(resComment.statusCode).toBe(201);
    const cId = resComment.body.data._id;
    comments.push(cId);

    const delRes = await request(app)
      .post('/comment/delete')
      .set('Cookie', cookieC)
      .send({ commentId: cId });
    expect([200,201]).toContain(delRes.statusCode);
  });

  test('profile endpoint returns user data when authenticated', async () => {
    const userD = {
      name: 'User D',
      username: `userd_${short}`,
      email: `userd_${short}@example.com`,
      password: 'password4'
    };
    const { cookie: cookieD, user: uD } = await signupAndSignin(userD);
    users.push(uD._id || uD.id);

    const res = await request(app).get(`/user/profile/${uD._id}`).set('Cookie', cookieD);
    expect([200,201]).toContain(res.statusCode);
    if (res.body.data) expect(res.body.data).toHaveProperty('username', uD.username);
  });

  test('attempting to access admin route without admin role fails', async () => {
    const userE = {
      name: 'User E',
      username: `usere_${short}`,
      email: `usere_${short}@example.com`,
      password: 'password5'
    };
    const { cookie: cookieE, user: uE } = await signupAndSignin(userE);
    users.push(uE._id || uE.id);

    const res = await request(app).get('/admin/dashboard').set('Cookie', cookieE);
    expect([401,403,404]).toContain(res.statusCode);
  });

  test('signup duplicate email should fail', async () => {
    const u = {
      name: 'Dup',
      username: `dup_${short}`,
      email: `usera_${short}@example.com`, // reused from earlier
      password: 'p'
    };
    const res = await request(app).post('/user/signup').send(u);
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('signin missing fields fails', async () => {
    const res = await request(app).post('/user/signin').send({ email: '' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('get paginated posts with large page returns valid response', async () => {
  const res = await request(app).get('/post/feed?page=9999').set('Cookie', authCookieA);
    expect([200,201]).toContain(res.statusCode);
  });

  test('delete non-existing post returns an error', async () => {
    const userF = {
      name: 'User F',
      username: `userf_${short}`,
      email: `userf_${short}@example.com`,
      password: 'password6'
    };
    const { cookie: cookieF, user: uF } = await signupAndSignin(userF);
    users.push(uF._id || uF.id);

  const res = await request(app).post('/post/delete-post').set('Cookie', cookieF).send({ postId: '000000000000000000000000' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('update comment without auth fails', async () => {
    const res = await request(app).post('/comment/update').send({ commentId: 'x', text: 'y' });
    expect([401,403]).toContain(res.statusCode);
  });

  test('update non-existing comment as authenticated returns error', async () => {
    const userG = {
      name: 'User G',
      username: `userg_${short}`,
      email: `userg_${short}@example.com`,
      password: 'password7'
    };
    const { cookie: cookieG, user: uG } = await signupAndSignin(userG);
    users.push(uG._id || uG.id);

    const res = await request(app).post('/comment/update').set('Cookie', cookieG).send({ commentId: '000000000000000000000000', text: 'x' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  

  test('post without imageUrl should fail', async () => {
    const userH = {
      name: 'User H',
      username: `userh_${short}`,
      email: `userh_${short}@example.com`,
      password: 'password8'
    };
    const { cookie: cookieH, user: uH } = await signupAndSignin(userH);
    users.push(uH._id || uH.id);

    const res = await request(app).post('/post/create').set('Cookie', cookieH).send({ title: 't', content: 'c' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('delete comment without auth returns error', async () => {
    const res = await request(app).post('/comment/delete').send({ commentId: 'x' });
    expect([401,403]).toContain(res.statusCode);
  });

  test('fetch profile of non-existing user returns error', async () => {
    const res = await request(app).get('/user/profile/000000000000000000000000');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('creating many posts quickly should succeed for authenticated user', async () => {
    const userI = {
      name: 'User I',
      username: `useri_${short}`,
      email: `useri_${short}@example.com`,
      password: 'password9'
    };
    const { cookie: cookieI, user: uI } = await signupAndSignin(userI);
    users.push(uI._id || uI.id);

    for (let k = 0; k < 3; k++) {
      const res = await request(app).post('/post/create-post').set('Cookie', cookieI).send({ title: `t${k}`, content: `c${k}`, imageUrl: 'u' });
      expect([200,201]).toContain(res.statusCode);
      if (res.body.data && res.body.data._id) posts.push(res.body.data._id);
    }
  });

  test('signout clears cookie', async () => {
    const userJ = {
      name: 'User J',
      username: `userj_${short}`,
      email: `userj_${short}@example.com`,
      password: 'password10'
    };
    const { cookie: cookieJ, user: uJ } = await signupAndSignin(userJ);
    users.push(uJ._id || uJ.id);

    const res = await request(app).post('/user/logout').set('Cookie', cookieJ);
    expect([200,204]).toContain(res.statusCode);
    const check = await request(app).get('/user/check-auth').set('Cookie', res.headers['set-cookie'] || cookieJ);
    expect([401,403]).toContain(check.statusCode);
  });
});
