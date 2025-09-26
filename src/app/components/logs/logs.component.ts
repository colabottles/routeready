import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../services/log.service';
import { DriverService } from '../../services/driver.service';
import { ActivityLog, EquipmentUsage } from '../../models/log.model';
import { Driver } from '../../models/driver.model';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="logs">
      <h2>Activity Logs</h2>
      
      <div class="filters">
        <select [(ngModel)]="selectedDriver" (change)="filterLogs()">
          <option value="">All Drivers</option>
          <option *ngFor="let driver of drivers" [value]="driver.id">
            {{ driver.name }}
          </option>
        </select>
        
        <select [(ngModel)]="selectedActivity" (change)="filterLogs()">
          <option value="">All Activities</option>
          <option value="departure">Departure</option>
          <option value="arrival">Arrival</option>
          <option value="property-visit">Property Visit</option>
          <option value="maintenance-complete">Maintenance Complete</option>
          <option value="equipment-use">Equipment Use</option>
        </select>
        
        <input type="date" [(ngModel)]="selectedDate" (change)="filterLogs()">
        
        <button class="btn btn-primary" (click)="exportLogs()">Export Logs</button>
      </div>

      <div class="logs-container">
        <div class="activity-logs">
          <h3>Activity Log</h3>
          <div class="log-table">
            <div class="log-header">
              <div class="col-time">Time</div>
              <div class="col-driver">Driver</div>
              <div class="col-activity">Activity</div>
              <div class="col-location">Location</div>
              <div class="col-details">Details</div>
            </div>
            <div class="log-row" *ngFor="let log of filteredLogs">
              <div class="col-time">{{ log.timestamp | date:'short' }}</div>
              <div class="col-driver">{{ getDriverName(log.driverId) }}</div>
              <div class="col-activity">
                <span class="activity-badge" [class]="'activity-' + log.activity">
                  {{ log.activity | titlecase }}
                </span>
              </div>
              <div class="col-location">{{ log.location }}</div>
              <div class="col-details">
                <div class="detail-item" *ngIf="log.mileage">
                  <strong>Mileage:</strong> {{ log.mileage | number }}
                </div>
                <div class="detail-item" *ngIf="log.equipment">
                  <strong>Equipment:</strong> {{ log.equipment }}
                </div>
                <div class="detail-item" *ngIf="log.duration">
                  <strong>Duration:</strong> {{ log.duration }}min
                </div>
                <div class="detail-item" *ngIf="log.notes">
                  <strong>Notes:</strong> {{ log.notes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="equipment-logs">
          <h3>Equipment Usage</h3>
          <div class="equipment-table">
            <div class="equipment-header">
              <div class="col-time">Time</div>
              <div class="col-driver">Driver</div>
              <div class="col-equipment">Equipment</div>
              <div class="col-duration">Duration</div>
              <div class="col-condition">Condition</div>
            </div>
            <div class="equipment-row" *ngFor="let usage of equipmentUsage">
              <div class="col-time">{{ usage.startTime | date:'short' }}</div>
              <div class="col-driver">{{ getDriverName(usage.driverId) }}</div>
              <div class="col-equipment">{{ usage.equipmentId }}</div>
              <div class="col-duration">{{ usage.duration }}min</div>
              <div class="col-condition">
                <span class="condition-badge" [class]="'condition-' + usage.condition">
                  {{ usage.condition | titlecase }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-stats">
        <div class="stat-card">
          <h4>Today's Summary</h4>
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-value">{{ todayStats.departures }}</span>
              <span class="stat-label">Departures</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ todayStats.arrivals }}</span>
              <span class="stat-label">Arrivals</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ todayStats.totalMileage }}</span>
              <span class="stat-label">Miles Driven</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ todayStats.propertiesServiced }}</span>
              <span class="stat-label">Properties Serviced</span>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <h4>Equipment Status</h4>
          <div class="equipment-stats">
            <div class="equipment-stat">
              <span class="equipment-name">Lawn Mower #1</span>
              <span class="equipment-hours">{{ 8.5 }}h today</span>
              <span class="status condition-good">Good</span>
            </div>
            <div class="equipment-stat">
              <span class="equipment-name">Pressure Washer</span>
              <span class="equipment-hours">{{ 3.2 }}h today</span>
              <span class="status condition-fair">Fair</span>
            </div>
            <div class="equipment-stat">
              <span class="equipment-name">Leaf Blower</span>
              <span class="equipment-hours">{{ 5.8 }}h today</span>
              <span class="status condition-needs-repair">Needs Repair</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logs {
      padding: 20px;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      align-items: center;
    }

    .filters select, .filters input {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .logs-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .activity-logs, .equipment-logs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .activity-logs h3, .equipment-logs h3 {
      margin: 0;
      padding: 20px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      color: #1f2937;
    }

    .log-table, .equipment-table {
      overflow-x: auto;
    }

    .log-header, .equipment-header {
      display: grid;
      grid-template-columns: 120px 100px 120px 120px 1fr;
      gap: 10px;
      padding: 15px 20px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 500;
      color: #6b7280;
      font-size: 14px;
    }

    .equipment-header {
      grid-template-columns: 120px 100px 120px 80px 100px;
    }

    .log-row, .equipment-row {
      display: grid;
      grid-template-columns: 120px 100px 120px 120px 1fr;
      gap: 10px;
      padding: 15px 20px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }

    .equipment-row {
      grid-template-columns: 120px 100px 120px 80px 100px;
    }

    .log-row:hover, .equipment-row:hover {
      background: #f9fafb;
    }

    .activity-badge, .condition-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .activity-departure { background: #dbeafe; color: #1e40af; }
    .activity-arrival { background: #d1fae5; color: #065f46; }
    .activity-property-visit { background: #fef3c7; color: #92400e; }
    .activity-maintenance-complete { background: #d1fae5; color: #065f46; }
    .activity-equipment-use { background: #e0e7ff; color: #3730a3; }

    .condition-good { background: #d1fae5; color: #065f46; }
    .condition-fair { background: #fef3c7; color: #92400e; }
    .condition-needs-repair { background: #fee2e2; color: #991b1b; }

    .detail-item {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 2px;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-card h4 {
      margin: 0 0 15px 0;
      color: #1f2937;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 12px;
      color: #6b7280;
    }

    .equipment-stats {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .equipment-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .equipment-name {
      font-weight: 500;
      color: #1f2937;
    }

    .equipment-hours {
      font-size: 14px;
      color: #6b7280;
    }

    .status {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .logs-container {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-wrap: wrap;
      }
      
      .summary-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LogsComponent implements OnInit {
  logs: ActivityLog[] = [];
  filteredLogs: ActivityLog[] = [];
  equipmentUsage: EquipmentUsage[] = [];
  drivers: Driver[] = [];
  
  selectedDriver = '';
  selectedActivity = '';
  selectedDate = '';

  todayStats = {
    departures: 3,
    arrivals: 2,
    totalMileage: 247,
    propertiesServiced: 8
  };

  constructor(
    private logService: LogService,
    private driverService: DriverService
  ) {}

  ngOnInit() {
    this.logService.getLogs().subscribe(logs => {
      this.logs = logs;
      this.filteredLogs = logs;
    });

    this.logService.getEquipmentUsage().subscribe(usage => {
      this.equipmentUsage = usage;
    });

    this.driverService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });
  }

  filterLogs() {
    this.filteredLogs = this.logs.filter(log => {
      const driverMatch = !this.selectedDriver || log.driverId === this.selectedDriver;
      const activityMatch = !this.selectedActivity || log.activity === this.selectedActivity;
      const dateMatch = !this.selectedDate || 
        log.timestamp.toDateString() === new Date(this.selectedDate).toDateString();
      
      return driverMatch && activityMatch && dateMatch;
    });
  }

  getDriverName(driverId: string): string {
    const driver = this.drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  }

  exportLogs() {
    console.log('Exporting logs...');
    // Implement export functionality
  }
}