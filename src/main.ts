import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { DriversComponent } from './app/components/drivers/drivers.component';
import { PropertiesComponent } from './app/components/properties/properties.component';
import { RoutesComponent } from './app/components/routes/routes.component';
import { AnalyticsComponent } from './app/components/analytics/analytics.component';
import { LogsComponent } from './app/components/logs/logs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app">
      <nav class="sidebar" role="navigation" aria-label="Main navigation">
        <div class="sidebar-header">
          <h1>RouteReady</h1>
          <p>Fleet Management System</p>
        </div>
        
        <ul class="nav-menu" role="menubar">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active" role="menuitem" 
               aria-label="Dashboard - View system overview and metrics">
              <span class="nav-icon">📊</span>
              Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/drivers" routerLinkActive="active" role="menuitem"
               aria-label="Drivers - Manage driver information and schedules">
              <span class="nav-icon">👥</span>
              Drivers
            </a>
          </li>
          <li>
            <a routerLink="/properties" routerLinkActive="active" role="menuitem"
               aria-label="Properties - Manage properties and maintenance schedules">
              <span class="nav-icon">🏢</span>
              Properties
            </a>
          </li>
          <li>
            <a routerLink="/routes" routerLinkActive="active" role="menuitem"
               aria-label="Routes - Create and optimize routes">
              <span class="nav-icon">🗺️</span>
              Routes
            </a>
          </li>
          <li>
            <a routerLink="/analytics" routerLinkActive="active" role="menuitem"
               aria-label="Analytics - View performance reports and insights">
              <span class="nav-icon">📈</span>
              Analytics
            </a>
          </li>
          <li>
            <a routerLink="/logs" routerLinkActive="active" role="menuitem"
               aria-label="Activity Logs - View driver activity and equipment usage">
              <span class="nav-icon">📋</span>
              Activity Logs
            </a>
          </li>
        </ul>
      </nav>
      
      <main class="main-content" role="main" aria-label="Main content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      display: flex;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .sidebar {
      width: 250px;
      background: #1f2937;
      color: white;
      padding: 20px 0;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .sidebar-header {
      padding: 0 20px 30px 20px;
      border-bottom: 1px solid #374151;
      margin-bottom: 20px;
    }

    .sidebar-header h1 {
      margin: 0 0 5px 0;
      font-size: 24px;
      font-weight: 700;
      color: #3b82f6;
    }

    .sidebar-header p {
      margin: 0;
      font-size: 14px;
      color: #9ca3af;
    }

    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-menu li {
      margin: 0;
    }

    .nav-menu a {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: #d1d5db;
      text-decoration: none;
      transition: all 0.2s;
      border-left: 3px solid transparent;
      outline: none;
    }

    .nav-menu a:hover {
      background: #374151;
      color: white;
      border-left-color: #3b82f6;
    }

    .nav-menu a:focus {
      background: #374151;
      color: white;
      border-left-color: #3b82f6;
      outline: 2px solid #60a5fa;
      outline-offset: -2px;
    }

    .nav-menu a.active {
      background: #374151;
      color: white;
      border-left-color: #3b82f6;
    }

    .nav-icon {
      margin-right: 12px;
      font-size: 16px;
      aria-hidden: true;
    }

    .main-content {
      flex: 1;
      background: #f5f5f5;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .app {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        order: 2;
      }
      
      .nav-menu {
        display: flex;
        overflow-x: auto;
      }
      
      .nav-menu li {
        flex-shrink: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-menu a {
        transition: none;
      }
    }
  `]
})
export class App {}

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'logs', component: LogsComponent }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});