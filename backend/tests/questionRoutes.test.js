const request = require('supertest');
const { app } = require('../app');
const Question = require('../models/Question');

const buildQuestionPayload = (overrides = {}) => ({
  question: 'What is 2 + 2?',
  incorrectAnswers: ['1', '3', '5'],
  correctAnswer: '4',
  category: 'Maths',
  ...overrides,
});

describe('Question routes', () => {
  describe('POST /api/questions', () => {
    it('creates a question with all required fields', async () => {
      const payload = buildQuestionPayload();

      const res = await request(app).post('/api/questions').send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        question: payload.question,
        correctAnswer: payload.correctAnswer,
        category: payload.category,
      });

      const questionsInDb = await Question.find();
      expect(questionsInDb).toHaveLength(1);
    });

    it('rejects payloads missing required values', async () => {
      const res = await request(app)
        .post('/api/questions')
        .send({ question: 'Incomplete payload' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
    });
  });

  describe('GET /api/questions', () => {
    beforeEach(async () => {
      await Question.create(buildQuestionPayload({ category: 'Maths' }));
      await Question.create(
        buildQuestionPayload({
          question: 'What is HTML?',
          category: 'Computer Science',
          incorrectAnswers: ['Programming Language', 'Database', 'Operating System'],
          correctAnswer: 'Markup Language',
        })
      );
    });

    it('returns all questions when no filter supplied', async () => {
      const res = await request(app).get('/api/questions');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('filters questions by category', async () => {
      const res = await request(app).get('/api/questions').query({ category: 'Maths' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].category).toBe('Maths');
    });
  });
});
