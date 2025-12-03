const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');

const buildUserPayload = (overrides = {}) => ({
  username: 'TestUser',
  email: 'test@example.com',
  password: 'Password!123',
  ...overrides,
});

describe('User routes', () => {
  describe('POST /api/users/register', () => {
    it('creates a new user and strips the password field', async () => {
      const payload = buildUserPayload();

      const res = await request(app).post('/api/users/register').send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        username: payload.username,
        email: payload.email,
        scores: [0, 0, 0, 0],
      });
      expect(res.body).not.toHaveProperty('password');

      const usersInDb = await User.find();
      expect(usersInDb).toHaveLength(1);
    });

    it('rejects duplicate email or username', async () => {
      await request(app).post('/api/users/register').send(buildUserPayload());

      const res = await request(app)
        .post('/api/users/register')
        .send(buildUserPayload());

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('validates required fields', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ email: 'missing@user.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/required/i);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/users/register').send(buildUserPayload());
    });

    it('authenticates with correct credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'Password!123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('rejects invalid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'WrongPassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });

  describe('GET /api/users', () => {
    it('returns the public fields only', async () => {
      await request(app)
        .post('/api/users/register')
        .send(buildUserPayload({ username: 'Alpha', email: 'alpha@example.com' }));

      const res = await request(app).get('/api/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({ username: 'Alpha', email: 'alpha@example.com' });
      expect(res.body[0]).not.toHaveProperty('password');
    });
  });

  describe('PATCH /api/users/score/:userId', () => {
    it('updates the score only when the new value is higher', async () => {
      const registration = await request(app)
        .post('/api/users/register')
        .send(buildUserPayload());

      const userId = registration.body._id;

      const firstUpdate = await request(app)
        .patch(`/api/users/score/${userId}`)
        .send({ categoryIndex: 0, score: 5 });

      expect(firstUpdate.statusCode).toBe(200);
      expect(firstUpdate.body.scores[0]).toBe(5);

      const secondUpdate = await request(app)
        .patch(`/api/users/score/${userId}`)
        .send({ categoryIndex: 0, score: 3 });

      expect(secondUpdate.statusCode).toBe(200);
      expect(secondUpdate.body.scores[0]).toBe(5);
    });

    it('validates category index bounds', async () => {
      const registration = await request(app)
        .post('/api/users/register')
        .send(buildUserPayload());

      const res = await request(app)
        .patch(`/api/users/score/${registration.body._id}`)
        .send({ categoryIndex: 10, score: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/invalid category/i);
    });
  });

  describe('GET /api/users/leaderboard', () => {
    it('returns all users with their scores', async () => {
      await request(app)
        .post('/api/users/register')
        .send(buildUserPayload({ username: 'Alpha', email: 'alpha@example.com' }));
      await request(app)
        .post('/api/users/register')
        .send(buildUserPayload({ username: 'Beta', email: 'beta@example.com' }));

      const res = await request(app).get('/api/users/leaderboard');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('scores');
    });
  });
});
