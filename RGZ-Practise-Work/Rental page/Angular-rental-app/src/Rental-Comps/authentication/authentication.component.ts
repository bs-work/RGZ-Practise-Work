import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./authentication.component.css']
})

export class AuthenticationComponent {
  isLoginVisible: boolean = true;
  username: string = '';
  email: string = '';
  password: string = '';
  loginEmail: string = '';
  loginPassword: string = '';
  errorMessages: string[] = [];
  successMessage: string = ''; 

  constructor(private authService: AuthService,private router: Router) {}

  toggleForms() {
    this.isLoginVisible = !this.isLoginVisible;
    this.errorMessages = []; 
    this.successMessage = '';   
  }

onLoginSubmit() {
  this.authService.login(this.loginEmail, this.loginPassword).subscribe(
    _response => {
      // console.log('Login response:', response);
      this.errorMessages = [];
      this.successMessage = 'Login successful! Redirecting...';

      setTimeout(() => {
        this.successMessage = '';
        this.router.navigate(['/dashboard']);
      }, 2000);  
    },
    error => {
      this.errorMessages = [];
      if (Array.isArray(error)) {
        this.errorMessages = error;
      } else {
        this.errorMessages.push('Login failed. Please try again.');
      }
      this.successMessage = '';
    }
  );
}
  onSignupSubmit() {
    this.authService.register(this.username, this.email, this.password).subscribe(
      _response => {
        this.errorMessages = []; 
        this.successMessage = 'Registration successful! Redirecting to login...'; 
        setTimeout(() => {
          this.successMessage = '';
          this.redirectToLogin();
        }, 2000); 
      },
      error => {
        this.errorMessages = []; 
        if (Array.isArray(error)) {
          this.errorMessages = error; 
        } else {
          this.errorMessages.push('Registration failed. Please try again.'); 
        }
        this.successMessage = ''; 
      }
    );
  }

  redirectToLogin() {
    this.isLoginVisible = false; 
  }
}



