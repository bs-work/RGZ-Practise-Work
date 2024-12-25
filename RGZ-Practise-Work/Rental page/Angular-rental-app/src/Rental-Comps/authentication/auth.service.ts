import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegistrationData {
  UserName: string;
  Email: string;
  Password: string;
}

export interface AuthResponse {
  username: any;
  token?: string; 
  message?: string;
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = 'https://localhost:44320/api/Registration';
  isAuthenticated = false;

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // debugger
    const loginData: LoginData = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        if (response.token) {
          // console.log('Token received:', response.token); 
          localStorage.setItem('token', response.token);
          this.isAuthenticated = true;
        } else if (response.message === 'Valid User') {
          console.log('Login successful: Valid User');
          this.isAuthenticated = true;
          localStorage.setItem('authState', 'true');
        } else {
          console.error('Invalid login response');
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('authState');
        this.isAuthenticated = false;
      }),
      catchError(this.handleError)
    );
  }

  checkAuthentication(): boolean {
    return !!localStorage.getItem('token') || localStorage.getItem('authState') === 'true';
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const registrationData: RegistrationData = { UserName: username, Email: email, Password: password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/registration`, registrationData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    console.error(`Backend returned code ${error.status}, body was:`, error.error);

    if (error.error && error.error.messages) {
      return throwError(error.error.messages || [error.error.message || errorMessage]);
    } else {
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
    return throwError([errorMessage]);
  }
}

