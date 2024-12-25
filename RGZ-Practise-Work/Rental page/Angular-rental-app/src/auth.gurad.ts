import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Rental-Comps/authentication/auth.service'; 

@Injectable({
   providedIn: 'root',
 })

 export class AuthGuard {
   constructor(private authService: AuthService, private router: Router) {}

   canActivate(): boolean {
     if (this.authService.checkAuthentication()) {
      console.log('Authenticated, allowing navigation to the dashboard.');
       return true;
     } else {
       this.router.navigate(['/authentication']);
       console.log('Not authenticated, redirecting to authentication page.');
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
