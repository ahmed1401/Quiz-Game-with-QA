import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  login(): void {
    console.log('Attempting login with:', this.email, this.password);
    this.error = null;

    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password!';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userId', response.user._id); 
        this.router.navigate(['/welcome']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.error = error.error?.message || 'An error occurred during login';
        this.isLoading = false;
      },
      
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}