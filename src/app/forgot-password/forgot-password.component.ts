import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  isSuccess = false;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  async handleForgotPassword() {
    this.errorMessage = null;
    
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('Forgot password request successful:', response);
        this.isSuccess = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Forgot password failed:', err);
        this.errorMessage = err.message || 'Failed to send reset email. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
