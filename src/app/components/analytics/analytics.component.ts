import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';
import { DriverService } from '../../services/driver.service';
import { PropertyService } from '../../services/property.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics">
      <h2>Analytics & Reporting</h2>
      
      <div class="analytics-grid">
        <div class="chart-card">
          <h3>Performance Metrics</h3>
          <div class="metrics-chart">
            <div class="metric-bar">
              <span class="metric-label">Route Efficiency</span>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="analytics.routeOptimization"></div>
              </div>
              <span class="metric-value">{{ analytics.routeOptimization }}%</span>
            </div>
            <div class="metric-bar">
              <span class="metric-label">Fuel Efficiency</span>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="analytics.fuelEfficiency"></div>
              </div>
              <span class="metric-value">{{ analytics.fuelEfficiency }}%</span>
            </div>
            <div class="metric-bar">
              <span class="metric-label">On-Time Completion</span>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="92"></div>
              </div>
              <span class="metric-value">92%</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Daily Productivity</h3>
          <div class="productivity-chart">
            <div class="day-bar" *ngFor="let day of weeklyData">
              <div class="day-label">{{ day.day }}</div>
              <div class="bar-container">
                <div class="bar" [style.height.%]="day.completed * 5"></div>
              </div>
              <div class="day-value">{{ day.completed }}</div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Driver Performance</h3>
          <div class="driver-performance">
            <div class="performance-item" *ngFor="let driver of driverPerformance">
              <div class="driver-name">{{ driver.name }}</div>
              <div class="performance-metrics">
                <div class="metric">
                  <span class="metric-label">Efficiency</span>
                  <span class="metric-value">{{ driver.efficiency }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Completed</span>
                  <span class="metric-value">{{ driver.completed }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Miles</span>
                  <span class="metric-value">{{ driver.miles }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Route Optimization Impact</h3>
          <div class="optimization-impact">
            <div class="impact-item">
              <div class="impact-icon">⛽</div>
              <div class="impact-content">
                <h4>Fuel Savings</h4>
                <p>$1,245 saved this month</p>
                <span class="impact-percentage">↓ 18%</span>
              </div>
            </div>
            <div class="impact-item">
              <div class="impact-icon">⏱️</div>
              <div class="impact-content">
                <h4>Time Savings</h4>
                <p>32 hours saved this month</p>
                <span class="impact-percentage">↓ 12%</span>
              </div>
            </div>
            <div class="impact-item">
              <div class="impact-icon">🚗</div>
              <div class="impact-content">
                <h4>Distance Savings</h4>
                <p>485 miles saved this month</p>
                <span class="impact-percentage">↓ 15%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Equipment Usage</h3>
          <div class="equipment-usage">
            <div class="equipment-item" *ngFor="let equipment of equipmentData">
              <div class="equipment-name">{{ equipment.name }}</div>
              <div class="usage-bar">
                <div class="usage-fill" [style.width.%]="equipment.usage"></div>
              </div>
              <div class="usage-stats">
                <span>{{ equipment.hours }}h</span>
                <span class="status" [class]="'status-' + equipment.status">
                  {{ equipment.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Monthly Trends</h3>
          <div class="trends-chart">
            <div class="trend-item">
              <h4>Completion Rate</h4>
              <div class="trend-value positive">+5.2%</div>
              <p>Compared to last month</p>
            </div>
            <div class="trend-item">
              <h4>Average Response Time</h4>
              <div class="trend-value negative">-8 min</div>
              <p>Faster than last month</p>
            </div>
            <div class="trend-item">
              <h4>Customer Satisfaction</h4>
              <div class="trend-value positive">+12%</div>
              <p>Improved from feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics {
      padding: 20px;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .chart-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-card h3 {
      margin-top: 0;
      color: #1f2937;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }

    .metrics-chart {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .metric-bar {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .metric-label {
      min-width: 120px;
      font-size: 14px;
      color: #6b7280;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #059669);
      transition: width 0.3s ease;
    }

    .metric-value {
      min-width: 40px;
      font-weight: 500;
      color: #1f2937;
    }

    .productivity-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 200px;
      padding: 20px 0;
    }

    .day-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .day-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 10px;
    }

    .bar-container {
      flex: 1;
      display: flex;
      align-items: flex-end;
      width: 20px;
    }

    .bar {
      width: 100%;
      background: linear-gradient(to top, #2563eb, #3b82f6);
      border-radius: 2px 2px 0 0;
      min-height: 10px;
      transition: height 0.3s ease;
    }

    .day-value {
      font-size: 12px;
      font-weight: 500;
      color: #1f2937;
      margin-top: 5px;
    }

    .driver-performance {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .performance-item {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
    }

    .driver-name {
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 10px;
    }

    .performance-metrics {
      display: flex;
      justify-content: space-between;
    }

    .metric {
      text-align: center;
    }

    .metric .metric-label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 5px;
    }

    .metric .metric-value {
      font-weight: 500;
      color: #1f2937;
    }

    .optimization-impact {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .impact-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .impact-icon {
      font-size: 24px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e5e7eb;
      border-radius: 50%;
    }

    .impact-content h4 {
      margin: 0 0 5px 0;
      color: #1f2937;
    }

    .impact-content p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .impact-percentage {
      font-weight: 500;
      color: #059669;
    }

    .equipment-usage {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .equipment-item {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .equipment-name {
      min-width: 100px;
      font-size: 14px;
      color: #1f2937;
    }

    .usage-bar {
      flex: 1;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .usage-fill {
      height: 100%;
      background: #2563eb;
      transition: width 0.3s ease;
    }

    .usage-stats {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .status {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-good {
      background: #d1fae5;
      color: #065f46;
    }

    .status-fair {
      background: #fef3c7;
      color: #92400e;
    }

    .status-needs-repair {
      background: #fee2e2;
      color: #991b1b;
    }

    .trends-chart {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    .trend-item {
      text-align: center;
      flex: 1;
    }

    .trend-item h4 {
      margin: 0 0 10px 0;
      color: #1f2937;
      font-size: 14px;
    }

    .trend-value {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .trend-value.positive {
      color: #059669;
    }

    .trend-value.negative {
      color: #059669;
    }

    .trend-item p {
      margin: 0;
      color: #6b7280;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .analytics-grid {
        grid-template-columns: 1fr;
      }
      
      .trends-chart {
        flex-direction: column;
        gap: 15px;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
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

  weeklyData = [
    { day: 'Mon', completed: 8 },
    { day: 'Tue', completed: 12 },
    { day: 'Wed', completed: 15 },
    { day: 'Thu', completed: 10 },
    { day: 'Fri', completed: 18 },
    { day: 'Sat', completed: 6 },
    { day: 'Sun', completed: 4 }
  ];

  driverPerformance = [
    { name: 'John Smith', efficiency: 94, completed: 23, miles: 156 },
    { name: 'Sarah Johnson', efficiency: 87, completed: 18, miles: 142 },
    { name: 'Mike Wilson', efficiency: 91, completed: 21, miles: 178 }
  ];

  equipmentData = [
    { name: 'Lawn Mower #1', usage: 85, hours: 34, status: 'good' },
    { name: 'Pressure Washer', usage: 62, hours: 25, status: 'fair' },
    { name: 'Leaf Blower', usage: 91, hours: 41, status: 'good' },
    { name: 'Truck #1', usage: 78, hours: 89, status: 'needs-repair' }
  ];

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
  }
}