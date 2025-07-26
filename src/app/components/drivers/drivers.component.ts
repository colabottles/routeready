import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../services/driver.service';
import { Driver, DriverSchedule } from '../../models/driver.model';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drivers" role="main">
      <div class="header">
        <h1>Driver Management</h1>
        <button class="btn btn-primary" (click)="showAddForm = true" 
                aria-label="Add new driver to the system">
          Add New Driver
        </button>
      </div>

      <section class="driver-grid" role="region" aria-labelledby="drivers-list-heading">
        <h2 id="drivers-list-heading" class="sr-only">List of Drivers</h2>
        <div class="driver-card" *ngFor="let driver of drivers">
          <div class="driver-header">
            <h3>{{ driver.name }}</h3>
            <span class="status-badge" [class]="'status-' + driver.status"
                  [attr.aria-label]="'Driver status: ' + driver.status">
              {{ driver.status | titlecase }}
            </span>
          </div>
          
          <div class="driver-details">
            <div class="detail-row">
              <span class="label" id="email-{{ driver.id }}">Email:</span>
              <span>{{ driver.email }}</span>
            </div>
            <div class="detail-row">
              <span class="label" id="phone-{{ driver.id }}">Phone:</span>
              <span>{{ driver.phone }}</span>
            </div>
            <div class="detail-row">
              <span class="label" id="license-{{ driver.id }}">License:</span>
              <span>{{ driver.licenseNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="label" id="vehicle-{{ driver.id }}">Vehicle:</span>
              <span>{{ driver.vehicleAssigned }}</span>
            </div>
            <div class="detail-row">
              <span class="label" id="miles-{{ driver.id }}">Total Miles:</span>
              <span>{{ driver.totalMileage | number }}</span>
            </div>
            <div class="detail-row">
              <span class="label" id="location-{{ driver.id }}">Location:</span>
              <span>{{ driver.currentLocation }}</span>
            </div>
          </div>

          <div class="driver-actions">
            <button class="btn btn-secondary" (click)="editDriver(driver)"
                    [attr.aria-label]="'Edit driver ' + driver.name">
              Edit
            </button>
            <button class="btn btn-primary" (click)="viewSchedule(driver)"
                    [attr.aria-label]="'View schedule for ' + driver.name">
              Schedule
            </button>
          </div>
        </div>
      </section>

      <!-- Add Driver Form -->
      <div class="modal" *ngIf="showAddForm" role="dialog" aria-labelledby="add-driver-title" aria-modal="true">
        <div class="modal-content">
          <h3 id="add-driver-title">Add New Driver</h3>
          <form (ngSubmit)="addDriver()" #driverForm="ngForm">
            <div class="form-group">
              <label for="driver-name">Name</label>
              <input type="text" id="driver-name" [(ngModel)]="newDriver.name" name="name" required
                     aria-describedby="name-error" aria-invalid="false">
            </div>
            <div class="form-group">
              <label for="driver-email">Email</label>
              <input type="email" id="driver-email" [(ngModel)]="newDriver.email" name="email" required
                     aria-describedby="email-error" aria-invalid="false">
            </div>
            <div class="form-group">
              <label for="driver-phone">Phone</label>
              <input type="tel" id="driver-phone" [(ngModel)]="newDriver.phone" name="phone" required
                     aria-describedby="phone-error" aria-invalid="false">
            </div>
            <div class="form-group">
              <label for="driver-license">License Number</label>
              <input type="text" id="driver-license" [(ngModel)]="newDriver.licenseNumber" name="license" required
                     aria-describedby="license-error" aria-invalid="false">
            </div>
            <div class="form-group">
              <label for="driver-vehicle">Vehicle Assigned</label>
              <input type="text" id="driver-vehicle" [(ngModel)]="newDriver.vehicleAssigned" name="vehicle"
                     aria-describedby="vehicle-help">
              <div id="vehicle-help" class="form-help">Optional: Assign a vehicle to this driver</div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelAdd()"
                      aria-label="Cancel adding new driver">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!driverForm.valid"
                      aria-label="Add new driver to the system">
                Add Driver
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Driver Schedules -->
      <section class="schedules-section" *ngIf="selectedDriver" role="region" 
               aria-labelledby="schedule-heading">
        <h2 id="schedule-heading">Schedule for {{ selectedDriver.name }}</h2>
        <div class="schedule-grid">
          <div class="schedule-card" *ngFor="let schedule of driverSchedules">
            <div class="schedule-header">
              <h3>{{ schedule.date | date:'mediumDate' }}</h3>
              <span class="status-badge" [class]="'status-' + schedule.status"
                    [attr.aria-label]="'Schedule status: ' + schedule.status">
                {{ schedule.status | titlecase }}
              </span>
            </div>
            <div class="schedule-details">
              <p><strong>Time:</strong> {{ schedule.startTime }} - {{ schedule.endTime }}</p>
              <p><strong>Routes:</strong> {{ schedule.routes.length }} assigned</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .drivers {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 2rem;
      color: #1f2937;
    }

    .driver-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .driver-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .driver-card:hover {
      transform: translateY(-2px);
    }

    .driver-card:focus-within {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    .driver-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }

    .driver-header h3 {
      margin: 0;
      color: #1f2937;
    }

    .status-badge {
      padding: 4px 12px;
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

    .driver-details {
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 5px 0;
    }

    .label {
      font-weight: 500;
      color: #6b7280;
    }

    .driver-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
      min-height: 44px;
      min-width: 44px;
    }

    .btn-primary {
      background: #1d4ed8;
      color: white;
    }

    .btn-primary:hover {
      background: #1e40af;
    }

    .btn-secondary {
      background: #4b5563;
      color: white;
    }

    .btn-secondary:hover {
      background: #374151;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #374151;
    }

    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      min-height: 44px;
    }

    .form-group input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .form-help {
      font-size: 12px;
      color: #6b7280;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .schedules-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .schedule-card {
      background: #f9fafb;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .schedule-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .schedule-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.125rem;
    }

    .schedule-details p {
      margin: 5px 0;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .driver-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = [];
  driverSchedules: DriverSchedule[] = [];
  selectedDriver: Driver | null = null;
  showAddForm = false;
  
  newDriver: Partial<Driver> = {
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    vehicleAssigned: '',
    status: 'inactive',
    totalMileage: 0,
    currentLocation: 'Office'
  };

  constructor(private driverService: DriverService) {}

  ngOnInit() {
    this.driverService.getDrivers().subscribe(drivers => {
      this.drivers = drivers;
    });

    this.driverService.getSchedules().subscribe(schedules => {
      this.driverSchedules = schedules;
    });
  }

  addDriver() {
    if (this.newDriver.name && this.newDriver.email && this.newDriver.phone && this.newDriver.licenseNumber) {
      const driver: Driver = {
        id: Date.now().toString(),
        name: this.newDriver.name,
        email: this.newDriver.email,
        phone: this.newDriver.phone,
        licenseNumber: this.newDriver.licenseNumber,
        vehicleAssigned: this.newDriver.vehicleAssigned || '',
        status: 'inactive',
        totalMileage: 0,
        currentLocation: 'Office',
        lastActivity: new Date()
      };

      this.driverService.addDriver(driver);
      this.cancelAdd();
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newDriver = {
      name: '',
      email: '',
      phone: '',
      licenseNumber: '',
      vehicleAssigned: '',
      status: 'inactive',
      totalMileage: 0,
      currentLocation: 'Office'
    };
  }

  editDriver(driver: Driver) {
    // Implement edit functionality
    console.log('Edit driver:', driver);
  }

  viewSchedule(driver: Driver) {
    this.selectedDriver = driver;
  }
}