import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Welcome1Component } from './welcome1/welcome1.component';
import { QuizComponent } from './quiz/quiz.component';
import { AuthGuard } from './guards/auth.guard';
import { LeaderboardComponent } from './leaderboard/leaderboard-component/leaderboard-component.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: Welcome1Component, canActivate: [AuthGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard]}
];