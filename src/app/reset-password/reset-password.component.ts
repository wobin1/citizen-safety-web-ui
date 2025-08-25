import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  newPassword = '';
  confirmPassword = '';
  resetToken = '';
  isLoading = false;
  isSuccess = false;
  invalidToken = false;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get the reset token from URL query parameters
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      if (!this.resetToken) {
        this.invalidToken = true;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async handleResetPassword() {
    this.errorMessage = null;
    
    if (!this.newPassword.trim()) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    if (!this.confirmPassword.trim()) {
      this.errorMessage = 'Please confirm your new password.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.resetToken) {
      this.errorMessage = 'Invalid reset token.';
      return;
    }

    this.isLoading = true;
    
    this.authService.resetPassword(this.resetToken, this.newPassword).subscribe({
      next: (response: any) => {
        console.log('Password reset successful:', response);
        this.isSuccess = true;
        this.isLoading = false;
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err: any) => {
        console.error('Password reset failed:', err);
        if (err.message.includes('Invalid') || err.message.includes('expired')) {
          this.invalidToken = true;
        } else {
          this.errorMessage = err.message || 'Failed to reset password. Please try again.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
