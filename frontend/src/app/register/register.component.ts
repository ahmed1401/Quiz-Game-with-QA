import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  register(): void {
    console.log('Register button clicked');
    this.error = null;

    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match!';
      return;
    }

    this.isLoading = true;
    this.authService.register(this.username, this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.error = error.error?.message || 'An error occurred during registration';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}