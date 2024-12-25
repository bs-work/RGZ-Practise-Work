take all the error data from the bakcend and show it in frontend becasue now it's only shows login or submit failed without expalning the error from backend
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Define interfaces for login and registration data
export interface LoginData {
  email: string;
  password: string;
}

export interface RegistrationData {
  UserName: string;
  Email: string;
  Password: string;
}

// Define an interface for the expected response
export interface AuthResponse {
  token?: string; 
  message?: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = 'https://localhost:44320/api/Registration';

  constructor(private http: HttpClient) {}

  // Login method
  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginData = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      catchError(this.handleError) 
    );
  }
  
  // Register method
  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const registrationData: RegistrationData = { UserName: username, Email: email, Password: password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/registration`, registrationData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
  
    // Log the error
    console.error(`Backend returned code ${error.status}, body was:`, error.error);
  
    // Check if the error contains a custom message from the backend
    if (error.error && error.error.messages) {
      // Return the backend error messages
      return throwError(error.error.messages);
    } else {
      // Handle other errors
      switch (error.status) {
        case 0:
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 401:
          errorMessage = 'Unauthorized access. Please check your credentials.';
          break;
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Unexpected error: ${error.message}`;
          break;
      }
    }
    return throwError(errorMessage); 
  }
}

import { Component } from '@angular/core';
import { AuthService } from './auth.service'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  isLoginVisible: boolean = true;

  // Form data
  username: string = '';
  email: string = '';
  password: string = '';
  loginEmail: string = '';
  loginPassword: string = '';

  // Messages
  errorMessages: string[] = [];
  successMessage: string = ''; 

  constructor(private authService: AuthService) {}

  // Toggle between Login and SignUp forms
  toggleForms() {
    this.isLoginVisible = !this.isLoginVisible;
    this.errorMessages = []; 
    this.successMessage = ''; 
  }

  // Handle login submission
  onLoginSubmit() {
    this.authService.login(this.loginEmail, this.loginPassword).subscribe(
      response => {
        this.errorMessages = [];
        this.successMessage = 'Login successful!'; 
        setTimeout(() => {
          this.successMessage = '';
          this.redirectToLogin();
        }, 3000);
      },
      error => {
        this.errorMessages = []; 
        if (error.error && error.error.messages) { 
          this.errorMessages = error.error.messages; 
        } else {
          this.errorMessages.push('Login failed. Please try again.'); 
        }
        this.successMessage = ''; 
      }
    );
  }

  // Handle signup submission
  onSignupSubmit() {
    this.authService.register(this.username, this.email, this.password).subscribe(
      response => {
        this.errorMessages = []; 
        this.successMessage = 'Registration successful! Redirecting to login...'; 
        setTimeout(() => {
          this.successMessage = '';
          this.redirectToLogin();
        }, 3000); 
      },
      error => {
        this.errorMessages = []; 
        if (error.error && error.error.messages) { 
          this.errorMessages = error.error.messages; 
        } else {
          this.errorMessages.push('Registration failed. Please try again.'); 
        }
        this.successMessage = ''; 
      }
    );
  }

  redirectToLogin() {
    this.isLoginVisible = true; 
  }
}