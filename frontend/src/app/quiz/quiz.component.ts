// quiz.component.ts
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './question/question.component';
import { QuizService } from '../services/quiz.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'quiz-app',
  standalone: true,
  imports: [CommonModule, QuestionComponent, RouterModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  quizService = inject(QuizService);
  
  ngOnInit() {
    const category = this.quizService.getStoredCategory();
    if (category) {
      this.quizService.loadQuestionsByCategory(category);
    }
  }
}