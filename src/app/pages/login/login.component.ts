import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

  standalone: true,

  imports: [],
})

export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) { }

  onLogin() {
    // A simple, hardcoded check for demonstration purposes.
    // In the real application, this will be an API call to the backend.
    if (this.email === 'admin@dashboard.com' && this.password === 'password123') {
      console.log('Login successful!');
      this.errorMessage = '';
      this.router.navigate(['/dashboard']); // Navigates to the dashboard page on success.
    } else {
      this.errorMessage = 'Invalid email or password.';
      console.log('Login failed!');
    }
  }
}