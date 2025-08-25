import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

// Define interfaces for better type safety
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Add other user properties as needed (e.g., roles)
}

export interface AuthResponse {
  status: string;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Use BehaviorSubject to hold the current user state, allowing components to subscribe
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  // Use BehaviorSubject to hold the login status
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  // Define your backend API base URL
  private apiUrl = environment.apiUrl; // Adjust this to your actual backend API URL

  constructor(private http: HttpClient, private router: Router) {
    // Initialize current user from localStorage (for persistent login)
    const storedUser = localStorage.getItem('currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Update isLoggedIn status based on initial user state
    this._isLoggedIn.next(!!user);
  }

  // Public getter for the current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Public getter for the current token
  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }



  /**
   * Fetches the current user from the backend using the /me endpoint.
   * The Authorization header is automatically set by the auth interceptor.
   * Updates the currentUserSubject and isLoggedIn state if successful.
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<{ data: User }>(`${this.apiUrl}auth/me`).pipe(
      tap(response => {
        if (response && response.data) {
          // Update local storage and BehaviorSubjects
          localStorage.setItem('currentUser', JSON.stringify(response.data));
          this.currentUserSubject.next(response.data);
          this._isLoggedIn.next(true);
        }
      }),
      map(response => response.data),
      catchError(error => {
        // If unauthorized or error, clear user state
        this.logout();
        return throwError(() => new Error(error.error?.message || 'Failed to fetch current user'));
      })
    );
  }

  // Login method
  login(username: string, password: string): Observable<AuthResponse> {
    // In a real app, send credentials to your backend login endpoint
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/login`, { email_or_username: username, password }).pipe(
      tap(response => {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));

        // Update BehaviorSubjects
        this.currentUserSubject.next(response.data.user);
        this._isLoggedIn.next(true);
        console.log('Login successful:', response.data.user.username);
      }),
      catchError(error => {
        console.error('Login failed in AuthService:', error);
        // Clear any stored data on failed login attempt
        this.logout();
        this._isLoggedIn.next(false);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  // Forgot password method
  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/forgot-password`, { email }).pipe(
      catchError(error => {
        console.error('Forgot password failed in AuthService:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to send reset email'));
      })
    );
  }

  // Reset password method
  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/reset-password`, { 
      token, 
      new_password: newPassword 
    }).pipe(
      catchError(error => {
        console.error('Reset password failed in AuthService:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to reset password'));
      })
    );
  }

  // Logout method
  logout(): void {
    // Remove user and token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Reset BehaviorSubjects
    this.currentUserSubject.next(null);
    this._isLoggedIn.next(false);

    // Navigate to login page
    this.router.navigate(['/auth/login']);
    console.log('User logged out.');
  }

  // Optional: Check token validity (e.g., on app load or route guard)
  // This would typically involve a call to your backend to validate the token
  // For simplicity, we'll just check for token presence here.
  checkAuth(): Observable<boolean> {
    const token = this.getToken();
    const user = this.currentUserValue;
    if (token && user) {
      // In a real app, you might make a /verify-token or /me API call
      // to ensure the token is still valid on the server side.
      return of(true); // Assume valid if token and user exist locally
    }
    return of(false);
  }
}
