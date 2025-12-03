// welcome1.component.ts
import { Component, OnInit, inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-welcome1',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome1.component.html',
  styleUrls: ['./welcome1.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Welcome1Component implements OnInit {
  private platformId = inject(PLATFORM_ID);
  username: string = '';
  selectedCategory: string | null = null;

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      this.username = user ? JSON.parse(user).username : 'Guest';
    } else {
      this.username = 'Guest';
    }
  }
  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
  
  startQuiz(): void {
    if (this.selectedCategory) {
      this.quizService.loadQuestionsByCategory(this.selectedCategory);
      this.quizService.setStoredCategory(this.selectedCategory);
      this.router.navigate(['/quiz']);
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

