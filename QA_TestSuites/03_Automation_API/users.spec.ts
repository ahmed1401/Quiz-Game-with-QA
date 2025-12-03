import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../backend/app';

const agent = request(app);

describe('Users API', () => {
  let createdId: string;

  beforeAll(async () => {
    // Connexion Mongo (adapter à mongodb-memory-server dans implémentation réelle)
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI as string);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('POST /api/users/register crée un utilisateur', async () => {
    const res = await agent.post('/api/users/register').send({
      username: 'qa_user',
      email: 'qa_user@example.com',
      password: 'Password!123',
      confirmPassword: 'Password!123',
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toContain('User registered');
    createdId = res.body.user._id;
    expect(res.body.user.scores).toEqual([0, 0, 0, 0]);
  });

  it('bloque le doublon email/username', async () => {
    const res = await agent.post('/api/users/register').send({
      username: 'qa_user',
      email: 'qa_user@example.com',
      password: 'Password!123',
      confirmPassword: 'Password!123',
    });

    expect(res.status).toBe(400);
  });

  it('PATCH /api/users/score/:id met à jour seulement si score supérieur', async () => {
    const res = await agent
      .patch(`/api/users/score/${createdId}`)
      .send({ categoryIndex: 0, score: 5 });

    expect(res.status).toBe(200);
    expect(res.body.user.scores[0]).toBe(5);

    const downgrade = await agent
      .patch(`/api/users/score/${createdId}`)
      .send({ categoryIndex: 0, score: 3 });

    expect(downgrade.status).toBe(200);
    expect(downgrade.body.user.scores[0]).toBe(5);
  });
});
