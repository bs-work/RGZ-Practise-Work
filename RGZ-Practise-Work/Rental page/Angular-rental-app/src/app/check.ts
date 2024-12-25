// check why my authguard it's not working after successfull login it's should go to dashboard and if not go to authenticate but it's not redirecting after succsesfull login
// //Authentication.Component.ts
// import { Component } from '@angular/core';
// import { AuthService } from './auth.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-authentication',
//   templateUrl: './authentication.component.html',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   styleUrls: ['./authentication.component.css']
// })

// export class AuthenticationComponent {
//   isLoginVisible: boolean = true;
//   username: string = '';
//   email: string = '';
//   password: string = '';
//   loginEmail: string = '';
//   loginPassword: string = '';

//   // Messages
//   errorMessages: string[] = [];
//   successMessage: string = '';

//   constructor(private authService: AuthService,private router: Router) {}

//   // Toggle between Login and SignUp forms
//   toggleForms() {
//     this.isLoginVisible = !this.isLoginVisible;
//     this.errorMessages = [];
//     this.successMessage = '';
//   }

//   // Handle login submission
//   onLoginSubmit() {
//     this.authService.login(this.loginEmail, this.loginPassword).subscribe(
//       response => {
//         console.log('Login response:', response);
//         this.errorMessages = [];
//         this.successMessage = 'Login successful!Please Wait...';
//         localStorage.setItem('user', JSON.stringify({ username: response.username }));
//         setTimeout(() => {
//             this.successMessage = ''
//             this.router.navigate(['/dashboard']);
//           }, 3000);
//       },
//       error => {
//         this.errorMessages = [];
//         if (Array.isArray(error)) {
//           this.errorMessages = error;
//         } else {
//           this.errorMessages.push('Login failed.Please try again.');
//         }
//         this.successMessage = '';
//       }
//     );
//   }

//   // Handle signup submission
//   onSignupSubmit() {
//     this.authService.register(this.username, this.email, this.password).subscribe(
//       response => {
//         this.errorMessages = [];
//         this.successMessage = 'Registration successful! Redirecting to login...';
//         setTimeout(() => {
//           this.successMessage = '';
//           this.redirectToLogin();
//         }, 3000);
//       },
//       error => {
//         this.errorMessages = [];
//         if (Array.isArray(error)) {
//           this.errorMessages = error;
//         } else {
//           this.errorMessages.push('Registration failed. Please try again.');
//         }
//         this.successMessage = '';
//       }
//     );
//   }

//   redirectToLogin() {
//     this.isLoginVisible = false;
//   }
// }

// //auth guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { AuthService } from './Rental-Comps/authentication/auth.service';

// @Injectable({
//   providedIn: 'root',
// })

// export class AuthGuard implements CanActivate {
//    constructor(private authService: AuthService, private router: Router) {}

//    canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
//       if (this.authService.checkAuthentication()) {
//          return true;
//       } else {
//          this.router.navigate(["/authentication"]);
//          return false;
//       }
//    }
// }

// //authservice.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';

// // for login and registration data
// export interface LoginData {
//   email: string;
//   password: string;
// }

// export interface RegistrationData {
//   UserName: string;
//   Email: string;
//   Password: string;
// }

// // interface for the expected response
// export interface AuthResponse {
//   username: any;
//   token?: string;
//   message?: string;
// }

// @Injectable({
//   providedIn: 'root',
// })

// export class AuthService {
//   isAuthenticated = false;

//   private apiUrl = 'https://localhost:44320/api/Registration';

//   constructor(private http: HttpClient) {
//   }

// checkAuthentication(): boolean {
//   return !!localStorage.getItem('token');
// }

//   // Login method
//   // login(email: string, password: string): Observable<AuthResponse> {
//   //   const loginData: LoginData = { email, password };
//   //   return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
//   //     catchError(this.handleError)
//   //   );
//   // }

//   login(email: string, password: string): Observable<AuthResponse> {
//     const loginData: LoginData = { email, password };
//     return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
//         tap(response => {
//             if (response.token) {
//                 this.isAuthenticated = true;
//                 localStorage.setItem('token', response.token);
//                 console.log('token',response.token)
//             }
//         }),
//         catchError(this.handleError),
//     );
// }

//   logout(): Observable<any> {
//     return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
//       tap(() => {
//         localStorage.removeItem('token');
//       }),
//       catchError(this.handleError)
//     );
//   }

//     // Register method
//   register(username: string, email: string, password: string): Observable<AuthResponse> {
//     const registrationData: RegistrationData = { UserName: username, Email: email, Password: password };
//     return this.http.post<AuthResponse>(`${this.apiUrl}/registration`, registrationData).pipe(
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'Something went wrong; please try again later.';

//     // Log the error
//     console.error(`Backend returned code ${error.status}, body was:`, error.error);

//     if (error.error && error.error.messages) {
//       return throwError(error.error.messages || [error.error.message || errorMessage]);
//     } else {
//       switch (error.status) {
//         case 0:
//           errorMessage = 'Network error. Please check your internet connection.';
//           break;
//         case 401:
//           errorMessage = 'Unauthorized access. Please check your credentials.';
//           break;
//         case 400:
//           errorMessage = 'Bad request. Please check your input.';
//           break;
//         case 500:
//           errorMessage = 'Server error. Please try again later.';
//           break;
//         default:
//           errorMessage = `Unexpected error: ${error.message}`;
//           break;
//       }
//     }
//     return throwError([errorMessage]);
//   }
// }

// import { Routes } from '@angular/router';
// import { HomeComponent } from './Home/home.component';
// import { AboutUsComponent } from './About-us/about-us.component';
// import { FleetMenuComponent } from './fleet-menu/fleet-menu.component';
// import { FAQComponent } from './FAQ/faq.component';
// import { ContactUsComponent } from './contact-us/contact-us.component';
// import { CareerComponent } from './career/career.component';
// import { BookingCardComponent } from './booking-card/booking-card.component';
// import { BookButtonComponent } from './book-button/book-button.component';
// import { FormCardComponent } from './form-card/form-card.component';
// import { AuthenticationComponent } from  './authentication/authentication.component'
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { AuthGuard } from '../auth.gurad';

// export const routes: Routes = [
//   {
//     path: "home",
//     component: HomeComponent,
//     data:{ BS:'Return Location', BD:'Return Date', BT: 'Return Time'},
//     // canActivate: [AuthGuard],
//   },
//   {
//     path: "aboutus",
//     component: AboutUsComponent,
//     canActivate: [AuthGuard]
//   },
//   {
//     path: "fleetmenu",
//     component: FleetMenuComponent
//   },
//   {
//     path: "faq",
//     component: FAQComponent
//   },
//   {
//     path: "contactus",
//     component: ContactUsComponent
//   },
//   {
//     path: "career",
//     component: CareerComponent
//   },

//   {
//     path: "",
//     component: HomeComponent,
//     data:{ BS:'Drop Location', BD: 'Drop Date', BT: 'Drop Time' }
//   },
//   //   {
//   //   path: "",
//   //   component: AuthenticationComponent,
//   // },

//   {
//     path: "bookingcard",
//     component: BookingCardComponent,

//   },
//   {
//     path: "bookbutton",
//     component: BookButtonComponent,

//   },
//   {
//   path: "formcard",
//   component: FormCardComponent,

//   },
//   {
//     path:"authentication",
//     component:AuthenticationComponent,
//   },
//   {
//     path:"dashboard",
//     component:DashboardComponent,
//     canActivate: [AuthGuard],
//   }
// ]

// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Configuration;
// using System.Data;
// using System.Data.SqlClient;
// using LoginRegistrationApp.Models;
// using System;
// using System.Text.RegularExpressions;
// using NSubstitute.Core;

// namespace LoginRegistrationApp.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class RegistrationController : ControllerBase
//     {
//         private readonly IConfiguration _configuration;

//         public RegistrationController(IConfiguration configuration)
//         {
//             _configuration = configuration;
//         }

//         [HttpPost]
//         [Route("registration")]
//         public IActionResult Registration(Registration registration)
//         {
//             // Basic validation
//             if (string.IsNullOrWhiteSpace(registration.UserName) ||
//                 string.IsNullOrWhiteSpace(registration.Password) ||
//                 string.IsNullOrWhiteSpace(registration.Email))
//             {
//                 return BadRequest(new { messages = new[] {"Username, Password, and Email are Required."} });
//             }

//             // Validate Email: Must contain '@' and '.'
//             if (!IsValidEmail(registration.Email))
//             {
//                 return BadRequest(new { messages = new[] {"Invalid Email Format."} });
//             }

//             // Validate Password
//             if (!IsValidPassword(registration.Password))
//             {
//                 return BadRequest(new { messages = new[] { "Password must be at least 8 characters long, contain at least one uppercase letter and one special character." } });
//             }

//             using (var con = new SqlConnection(_configuration.GetConnectionString("TestDb")))
//             {
//                 // Check if the user already exists by email
//                 string checkUserQuery = "SELECT COUNT(*) FROM Registration WHERE Email = @Email";
//                 using (var checkUserCmd = new SqlCommand(checkUserQuery, con))
//                 {
//                     checkUserCmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = registration.Email;
//                     con.Open();

//                     // ExecuteScalar returns the count of matching records (should be 0 or 1)
//                     object result = checkUserCmd.ExecuteScalar();
//                     int userExists = Convert.ToInt32(result); // Safely convert to int
//                     con.Close();

//                     // If user already exists, return a conflict response
//                     if (userExists > 0)
//                     {
//                         return Conflict(new { messages = new[] { "User Already Exists With This Email." } });
//                     }
//                 }

//                 // Proceed to insert the new user with the plain-text password
//                 string query = "INSERT INTO Registration (UserName, Password, Email) VALUES (@UserName, @Password, @Email)";
//                 using (var cmd = new SqlCommand(query, con))
//                 {
//                     cmd.Parameters.Add("@UserName", SqlDbType.NVarChar).Value = registration.UserName;
//                     cmd.Parameters.Add("@Password", SqlDbType.NVarChar).Value = registration.Password; // Store plain-text password
//                     cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = registration.Email;

//                     con.Open();
//                     int rowsAffected = cmd.ExecuteNonQuery(); // Get the number of rows affected
//                     con.Close();
//                     if (rowsAffected > 0)
//                     {
//                         return Ok(new { message = "User Registered Successfully." });
//                     }
//                     else
//                     {
//                         return BadRequest(new { message = "Error inserting data." });
//                     }
//                 }
//             }
//         }

//         [HttpPost]
//         [Route("login")]
//         public IActionResult Login([FromBody] Login login)
//         {
//             // Basic validation: Ensure email and password are provided
//             if (string.IsNullOrWhiteSpace(login.Email) || string.IsNullOrWhiteSpace(login.Password))
//             {
//                 return BadRequest(new { messages = new[] { "Email and Password are Required." } });
//             }

//             using (var con = new SqlConnection(_configuration.GetConnectionString("TestDb")))
//             {
//                 string query = "SELECT Password FROM Registration WHERE Email = @Email";
//                 using (var cmd = new SqlCommand(query, con))
//                 {
//                     cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = login.Email;
//                     con.Open();

//                     // Fetch the stored password from the database
//                     object result = cmd.ExecuteScalar(); // ExecuteScalar returns an object

//                     // Check if the result is null (user not found)
//                     if (result == null)
//                     {
//                         return Unauthorized(new { message = "Invalid User" }); // User not found with this email
//                     }

//                     string storedPassword = result as string;  // Safely cast to string
//                     con.Close();

//                     // Verify the provided password (which is a string) against the stored password (also a string)
//                     if (storedPassword == login.Password)
//                     {
//                         return Ok(new { message = "Valid User" });
//                     }
//                     else
//                     {
//                         return Unauthorized(new { message = "Invalid password." }); // Incorrect password
//                     }
//                 }
//             }
//         }

//         // Helper function to validate email format
//         private bool IsValidEmail(string email)
//         {
//             var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
//             var regex = new Regex(emailPattern);
//             return regex.IsMatch(email);
//         }

//         // validate password
//         private bool IsValidPassword(string password)
//         {
//             if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
//                 return false;

//             bool hasUpperCase = false;
//             bool hasSpecialChar = false;
//             foreach (char c in password)
//             {
//                 if (char.IsUpper(c))
//                     hasUpperCase = true;
//                 if (!char.IsLetterOrDigit(c))
//                     hasSpecialChar = true;
//             }

//             return hasUpperCase && hasSpecialChar;
//         }

//         [HttpPost("logout")]
//         public IActionResult Logout()
//         {
//             return Ok();
//         }

//         // Test connection to the database
//         [HttpGet]
//         [Route("test-connection")]
//         public IActionResult TestConnection()
//         {
//             try
//             {
//                 using (var con = new SqlConnection(_configuration.GetConnectionString("TestDb")))
//                 {
//                     con.Open();
//                     return Ok(new { message = "Connection successful!" });
//                 }
//             }
//             catch (Exception ex)
//             {
//                 return BadRequest(new { message = $"Connection failed: {ex.Message}"});
//             }
//         }
//     }
// }

//check why my auth guard is getting false even after sucesfull login from authguard.ts file and not going to dashboard after successfull login
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
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent {
  isLoginVisible: boolean = true;
  username: string = '';
  email: string = '';
  password: string = '';
  loginEmail: string = '';
  loginPassword: string = '';

  // Messages
  errorMessages: string[] = [];
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Toggle between Login and SignUp forms
  toggleForms() {
    this.isLoginVisible = !this.isLoginVisible;
    this.errorMessages = [];
    this.successMessage = '';
  }

  onLoginSubmit() {
    // debugger;
    this.authService.login(this.loginEmail, this.loginPassword).subscribe(
      (response) => {
        console.log('Login response:', response);
        this.errorMessages = [];
        this.successMessage = 'Login successful! Please Wait...';

        // if (response.token) {
        //   localStorage.setItem('token', response.token);
        // }

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/dashboard']);
        }, 2000);
      },

      (error) => {
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

  // Handle signup submission
  onSignupSubmit() {
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(
        (response) => {
          this.errorMessages = [];
          this.successMessage =
            'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.successMessage = '';
            this.redirectToLogin();
          }, 3000);
        },
        (error) => {
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

// interface for the expected response
export interface AuthResponse {
  username: any;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: any;
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // isAuthenticated = false;

  private apiUrl = 'https://localhost:44320/api/Registration';

  constructor(private http: HttpClient) {}

  //   checkAuthentication(): boolean {
  //     return !!localStorage.getItem('token');
  // }

  // Login method
  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginData = { email, password };
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(catchError(this.handleError));
  }

  //   login(email: string, password: string): Observable<AuthResponse> {
  //     const loginData: LoginData = { email, password };
  //     return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
  //         tap(response => {
  //             if (response.token) {

  //                 localStorage.setItem('token', response.token);
  //                 console.log('token',response.token)
  //             }
  //         }),
  //         catchError(this.handleError),
  //     );
  // }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
      }),
      catchError(this.handleError)
    );
  }

  // Register method
  register(
    username: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    const registrationData: RegistrationData = {
      UserName: username,
      Email: email,
      Password: password,
    };
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/registration`, registrationData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';

    // Log the error
    console.error(
      `Backend returned code ${error.status}, body was:`,
      error.error
    );

    if (error.error && error.error.messages) {
      return throwError(
        error.error.messages || [error.error.message || errorMessage]
      );
    } else {
      switch (error.status) {
        case 0:
          errorMessage =
            'Network error. Please check your internet connection.';
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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Rental-Comps/authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/authentication']);
      return false;
    }
  }
}

//    canActivate(): boolean {
//       if (this.authService.checkAuthentication()) {
//          console.log('Authenticated, allowing navigation to the dashboard.');
//          return true;
//       } else {
//          console.log('Not authenticated, redirecting to authentication page.');
//          this.router.navigate(["/authentication"]);
//          return false;
//       }
//    }
// }

// export class AuthGuard {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.authService.isAuthenticated()) {
//       return true;
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }
