<!-- Login Form  -->
<section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card bg-dark text-white" style="border-radius: 1rem;">
                    <div class="card-body p-5 text-center">
                        <div class="mb-md-5 mt-md-4 pb-5">
                            <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                            <p class="text-white-50 mb-5">Please enter your login and password!</p>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input type="email" id="typeEmailX" class="form-control form-control-lg" />
                                <label class="form-label" for="typeEmailX">Email</label>
                            </div>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input type="password" id="typePasswordX" class="form-control form-control-lg" />
                                <label class="form-label" for="typePasswordX">Password</label>
                            </div>
                            <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
                        </div>
                        <div>
                            <p class="mb-0">Don't have an account? <a class="text-white-50 fw-bold" (click)="toggleForms()">Sign Up</a></p>
                        </div>
                    </div>
                </div>
                <!-- Signup Form -->
                <div class="card bg-dark text-white mt-4" style="border-radius: 1rem;" *ngIf="!isLoginVisible">
                    <div class="card-body p-5 text-center">
                        <div class="mb-md-5 mt-md-4 pb-5">
                            <h2 class="fw-bold mb-2 text-uppercase">Sign Up</h2>
                            <p class="text-white-50 mb-5">Please enter your details to create an account!</p>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input type="text" id="typeUsername" class="form-control form-control-lg" />
                                <label class="form-label" for="typeUsername">Username</label>
                            </div>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input type="email" id="typeEmailSignup" class="form-control form-control-lg" />
                                <label class="form-label" for="typeEmailSignup">Email</label>
                            </div>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input type="password" id="typePasswordSignup" class="form-control form-control-lg" />
                                <label class="form-label" for="typePasswordSignup">Password</label>
                            </div>
                            <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" type="submit">Sign Up</button>
                        </div>
                        <div>
                            <p class="mb-0">Already have an account? <a  class="text-white-50 fw-bold" (click)="toggleForms()">Login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </section>

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {
  isLoginVisible: boolean = true;

  toggleForms() {
    this.isLoginVisible = !this.isLoginVisible;
  }
}

<!-- Login Form -->
<section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card bg-dark text-white" style="border-radius: 1rem;">
                    <div class="card-body p-5 text-center">
                        <div class="mb-md-5 mt-md-4 pb-5">
                            <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                            <p class="text-white-50 mb-5">Please enter your login and password!</p>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input [(ngModel)]="loginEmail" type="email" id="typeEmailX" class="form-control form-control-lg" />
                                <label class="form-label" for="typeEmailX">Email</label>
                            </div>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input [(ngModel)]="loginPassword" type="password" id="typePasswordX" class="form-control form-control-lg" />
                                <label class="form-label" for="typePasswordX">Password</label>
                            </div>
                            <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" (click)="onLoginSubmit()">Login</button>
                        </div>
                        <div>
                            <p class="mb-0">Don't have an account? <a class="text-white-50 fw-bold" (click)="toggleForms()">Sign Up</a></p>
                        </div>
                    </div>
                </div>
  
                <!-- Signup Form -->
                <div class="card bg-dark text-white mt-4" style="border-radius: 1rem;" *ngIf="!isLoginVisible">
                    <div class="card-body p-5 text-center">
                        <div class="mb-md-5 mt-md-4 pb-5">
                            <h2 class="fw-bold mb-2 text-uppercase">Sign Up</h2>
                            <p class="text-white-50 mb-5">Please enter your details to create an account!</p>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input [(ngModel)]="username" type="text" id="typeUsername" class="form-control form-control-lg" />
                                <label class="form-label" for="typeUsername">Username</label>
                            </div>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input [(ngModel)]="email" type="email" id="typeEmailSignup" class="form-control form-control-lg" />
                                <label class="form-label" for="typeEmailSignup">Email</label>
                            </div>
                            <div data-mdb-input-init class="form-outline form-white mb-4">
                                <input [(ngModel)]="password" type="password" id="typePasswordSignup" class="form-control form-control-lg" />
                                <label class="form-label" for="typePasswordSignup">Password</label>
                            </div>
                            <button data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-light btn-lg px-5" (click)="onSignupSubmit()">Sign Up</button>
                        </div>
                        <div>
                            <p class="mb-0">Already have an account? <a class="text-white-50 fw-bold" (click)="toggleForms()">Login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </section>

import { Component } from '@angular/core';
import { AuthService } from './auth.service'; 
import { ToasterService } from './toaster.service'; 
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

  constructor(
    private authService: AuthService, 
    private toasterService: ToasterService // Inject the ToasterService
  ) {}

  // Toggle between Login and SignUp forms
  toggleForms() {
    this.isLoginVisible = !this.isLoginVisible;
  }

  // Login form submission
  onLoginSubmit() {
    if (this.loginEmail && this.loginPassword) {
      this.authService.login(this.loginEmail, this.loginPassword).subscribe({
        next: (response: any) => {
          this.toasterService.success('Login successful!');
          // You can handle the response (e.g., redirect to dashboard)
        },
        error: (error: any) => {
          this.toasterService.error('Invalid email or password!');
        }
      });
    } else {
      this.toasterService.error('Please enter both email and password.');
    }
  }

  // SignUp form submission
  onSignupSubmit() {
    if (this.username && this.email && this.password) {
      this.authService.register(this.username, this.email, this.password).subscribe({
        next: (response: any) => {
          this.toasterService.success('Registration successful!');
          this.toggleForms(); // Switch to login form after successful registration
        },
        error: (error: any) => {
          this.toasterService.error('Error during registration!');
        }
      });
    } else {
      this.toasterService.error('Please fill all fields.');
    }
  }
}

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
  token?: string; // Assuming your API returns a token
  message?: string; // Any message from the API
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
      catchError(this.handleError) // Handle errors
    );
  }

  // Register method
  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const registrationData: RegistrationData = { UserName: username, Email: email, Password: password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/registration`, registrationData).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    
    // Handle different error statuses here
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
      errorMessage = 'A client-side error occurred. Please check your input.';
    } else {
      // Server-side error
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      if (error.status === 401) {
        errorMessage = 'Unauthorized access. Please check your credentials.';
      } else if (error.status === 400) {
        errorMessage = 'Bad request. Please check your input.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
    }
    // Return an observable with a user-facing error message
    return throwError(errorMessage);
  }
}