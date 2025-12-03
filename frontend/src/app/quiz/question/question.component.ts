import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { AnswerComponent } from '../answer/answer.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, AnswerComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class QuestionComponent {
  quizService = inject(QuizService);
}
