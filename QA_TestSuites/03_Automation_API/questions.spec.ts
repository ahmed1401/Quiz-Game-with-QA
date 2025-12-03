import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../backend/app';

describe('Questions API', () => {
  beforeAll(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI as string);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('GET /api/questions retourne les questions par catégorie', async () => {
    const res = await request(app).get('/api/questions?category=Computer%20Science');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('question');
  });

  it('rejette un POST avec catégorie invalide', async () => {
    const res = await request(app).post('/api/questions').send({
      question: 'Foo',
      incorrectAnswers: ['a', 'b', 'c'],
      correctAnswer: 'Bar',
      category: 'History',
    });
    expect(res.status).toBe(400);
  });
});
