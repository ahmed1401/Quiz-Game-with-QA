import { Component, computed, inject } from '@angular/core';
import { input } from '@angular/core';
import { Signal } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'quiz-answer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
})
export class AnswerComponent {
  quizService = inject(QuizService);
  answerText = input.required<string>();
  answerIndex = input.required<number>();

  letterMapping = ['A', 'B', 'C', 'D'];
  isCorrectAnswer = computed(
    () =>
      !!this.quizService.currentAnswer() &&
      this.answerText() === this.quizService.getCurrentQuestion().correctAnswer
  );
  isWrongAnswer = computed(
    () =>
      this.answerText() === this.quizService.currentAnswer() &&
      this.quizService.currentAnswer() !==
        this.quizService.getCurrentQuestion().correctAnswer
  );
}
