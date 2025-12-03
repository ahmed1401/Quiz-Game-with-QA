/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuizService } from './quiz.service';

const expectJasmine = globalThis.expect as any;

describe('QuizService', () => {
  let service: QuizService;
  let httpMock: HttpTestingController;

  const mockQuestions = [
    {
      _id: 'q1',
      question: 'What is 2 + 2?',
      correctAnswer: '4',
      incorrectAnswers: ['1', '2', '3'],
      category: 'Maths',
    },
    {
      _id: 'q2',
      question: 'Capital of France?',
      correctAnswer: 'Paris',
      incorrectAnswers: ['London', 'Madrid', 'Rome'],
      category: 'Maths',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        QuizService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(QuizService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads questions by category and resets the state', () => {
    service.correctAnswerCount.set(5);
    service.currentQuestionIndex.set(2);

    service.loadQuestionsByCategory('Maths');

    expectJasmine(service.isLoading()).toBeTrue();

    const req = httpMock.expectOne('http://localhost:5000/api/questions?category=Maths');
    expectJasmine(req.request.method).toBe('GET');
    req.flush(mockQuestions);

    expectJasmine(service.isLoading()).toBeFalse();
    expectJasmine(service.questions()).toEqual(mockQuestions as any);
    expectJasmine(service.currentQuestionIndex()).toBe(0);
    expectJasmine(service.correctAnswerCount()).toBe(0);
  });

  it('clears questions and loading state when the API errors', () => {
    service.loadQuestionsByCategory('Maths');

    const req = httpMock.expectOne('http://localhost:5000/api/questions?category=Maths');
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

    expectJasmine(service.questions()).toEqual([]);
    expectJasmine(service.isLoading()).toBeFalse();
  });

  it('increments the score only when the selected answer is correct', () => {
    service.questions.set([mockQuestions[0] as any]);
    expectJasmine(service.correctAnswerCount()).toBe(0);

    service.selectAnswer('4');
    expectJasmine(service.correctAnswerCount()).toBe(1);

    service.selectAnswer('wrong');
    expectJasmine(service.correctAnswerCount()).toBe(1);
  });

  it('persists the score when the quiz finishes and data is available', () => {
    service.questions.set([mockQuestions[0] as any]);
    service.correctAnswerCount.set(1);
    localStorage.setItem('quizCategory', 'Computer Science');
    localStorage.setItem('userId', 'user-1');

    service.onNextQuestion();

    const req = httpMock.expectOne('http://localhost:5000/api/users/score/user-1');
    expectJasmine(req.request.method).toBe('PATCH');
    expectJasmine(req.request.body).toEqual({ categoryIndex: 0, score: 1 });
    req.flush({ scores: [1, 0, 0, 0] });
  });
});
