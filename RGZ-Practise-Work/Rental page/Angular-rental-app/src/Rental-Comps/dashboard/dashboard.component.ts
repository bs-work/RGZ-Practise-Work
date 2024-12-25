import { Component } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  constructor (private authService: AuthService, private router: Router) { }
  logout() {
    const confirmLogout = confirm('Are you sure you want to log out?');
    if (confirmLogout) {
        this.authService.logout().subscribe({
            next: () => {
                localStorage.removeItem('user');
                this.router.navigate(['/authentication']);
            },
            error: (err: any) => {
                console.error('Logout failed', err); 
                alert('Logout failed. Please try again.'); 
            }
        });
    }
}
}
