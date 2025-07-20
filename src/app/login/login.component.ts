import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngIf
import { FormsModule } from '@angular/forms'; // For ngModel (Template-driven forms)
import { Router, RouterLink } from '@angular/router'; // For navigation
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username = '';
  password = '';
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) { } // Inject AuthService

  async handleLogin() {
    this.errorMessage = null;
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful!', response.status);
        this.router.navigate(['/dashboard']); // Navigate to dashboard on success
      },
      error: (err) => {
        console.error('Login failed in component:', err);
        this.errorMessage = err.message || 'Invalid email or password.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
