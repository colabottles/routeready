import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';
import { DriverService } from '../../services/driver.service';
import { PropertyService } from '../../services/property.service';
import { LogService } from '../../services/log.service';
import { Driver } from '../../models/driver.model';
import { Property } from '../../models/property.model';
import { ActivityLog } from '../../models/log.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard" role="main">
      <header>
        <h1>Dashboard Overview</h1>
        <p class="sr-only">System metrics and active driver information</p>
      </header>
      
      <section class="metrics-grid" role="region" aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" class="sr-only">Key Performance Metrics</h2>
        <div class="metric-card">
          <div class="metric-icon">👥</div>
          <div class="metric-content">
            <h3>Active Drivers</h3>
            <div class="metric-value" aria-label="Active drivers: {{ analytics.activeDrivers }} out of {{ analytics.totalDrivers }} total">
              {{ analytics.activeDrivers }}/{{ analytics.totalDrivers }}
            </div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">🏢</div>
          <div class="metric-content">
            <h3>Properties</h3>
            <div class="metric-value" aria-label="Total properties: {{ analytics.totalProperties }}">
              {{ analytics.totalProperties }}
            </div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">✅</div>
          <div class="metric-content">
            <h3>Completed Today</h3>
            <div class="metric-value" aria-label="Tasks completed today: {{ analytics.completedToday }}">
              {{ analytics.completedToday }}
            </div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">🚗</div>
          <div class="metric-content">
            <h3>Total Mileage</h3>
            <div class="metric-value" aria-label="Total mileage: {{ analytics.totalMileage | number }} miles">
              {{ analytics.totalMileage | number }}
            </div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">⛽</div>
          <div class="metric-content">
            <h3>Fuel Efficiency</h3>
            <div class="metric-value" aria-label="Fuel efficiency: {{ analytics.fuelEfficiency }} percent">
              {{ analytics.fuelEfficiency }}%
            </div>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">📊</div>
          <div class="metric-content">
            <h3>Route Optimization</h3>
            <div class="metric-value" aria-label="Route optimization: {{ analytics.routeOptimization }} percent">
              {{ analytics.routeOptimization }}%
            </div>
          </div>
        </div>
      </section>
      
      <div class="dashboard-content">
        <section class="active-drivers" role="region" aria-labelledby="active-drivers-heading">
          <h2 id="active-drivers-heading">Active Drivers</h2>
          <div class="driver-list" role="list">
            <div class="driver-item" *ngFor="let driver of drivers">
              <div class="driver-info">
                <h3>{{ driver.name }}</h3>
                <p>{{ driver.currentLocation }}</p>
                <span class="status-badge" [class]="'status-' + driver.status" 
                      aria-label="Driver status: {{ driver.status }}">
                  {{ driver.status | titlecase }}
                </span>
              </div>
              <div class="driver-stats">
                <span aria-label="Total mileage: {{ driver.totalMileage | number }} miles">
                  {{ driver.totalMileage | number }} miles
                </span>
              </div>
            </div>
          </div>
        </section>
        
        <section class="recent-activity" role="region" aria-labelledby="recent-activity-heading">
          <h2 id="recent-activity-heading">Recent Activity</h2>
          <div class="activity-list" role="list">
            <div class="activity-item" *ngFor="let log of recentLogs">
              <div class="activity-time">{{ log.timestamp | date:'short' }}</div>
              <div class="activity-details">
                <strong>{{ getDriverName(log.driverId) }}</strong>
                <span class="activity-type" aria-label="Activity type: {{ log.activity | titlecase }}">
                  {{ log.activity | titlecase }}
                </span>
                <span class="activity-location">{{ log.location }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }

    header h1 {
      margin-bottom: 20px;
      font-size: 2rem;
      color: #1f2937;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 15px;
      transition: transform 0.2s;
    }

    .metric-card:hover {
      transform: translateY(-2px);
    }

    .metric-card:focus-within {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    .metric-icon {
      font-size: 24px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f9ff;
      border-radius: 50%;
      aria-hidden: true;
    }

    .metric-content h3 {
      margin: 0 0 5px 0;
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }

    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .active-drivers, .recent-activity {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .active-drivers h2, .recent-activity h2 {
      margin-top: 0;
      color: #1f2937;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }

    .driver-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .driver-item:last-child {
      border-bottom: none;
    }

    .driver-info h3 {
      margin: 0 0 5px 0;
      color: #1f2937;
      font-size: 1.125rem;
    }

    .driver-info p {
      margin: 0 0 5px 0;
      color: #6b7280;
      font-size: 14px;
    }

    .status-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-active {
      background: #d1fae5;
      color: #047857;
    }

    .status-inactive {
      background: #fee2e2;
      color: #b91c1c;
    }

    .status-on-route {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .driver-stats {
      color: #6b7280;
      font-size: 14px;
    }

    .activity-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .activity-item {
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-time {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 5px;
    }

    .activity-details {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .activity-type {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      color: #374151;
    }

    .activity-location {
      color: #6b7280;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
      
      .metrics-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
  `]
    @media (prefers-reduced-motion: reduce) {
      .metric-card {
        transition: none;
      }
    }
})
export class DashboardComponent implements OnInit {
  analytics: AnalyticsData = {
    totalDrivers: 0,
    activeDrivers: 0,
    totalProperties: 0,
    completedToday: 0,
    totalMileage: 0,
    fuelEfficiency: 0,
    averageCompletionTime: 0,
    routeOptimization: 0
  };
  
  drivers: Driver[] = [];
  properties: Property[] = [];
  recentLogs: ActivityLog[] = [];

  constructor(
    private analyticsService: AnalyticsService,
    private driverService: DriverService,
    private propertyService: PropertyService,
    private logService: LogService
  ) {}

  ngOnInit() {
    this.analyticsService.getAnalytics().subscribe(data => {
      this.analytics = data;
    });

    this.driverService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });

    this.propertyService.getProperties().subscribe(properties => {
      this.properties = properties;
    });

    this.logService.getLogs().subscribe(logs => {
      this.recentLogs = logs.slice(0, 10);
    });
  }

  getDriverName(driverId: string): string {
    const driver = this.drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  }
}