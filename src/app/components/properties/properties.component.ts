import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="properties">
      <div class="header">
        <h2>Property Management</h2>
        <button class="btn btn-primary" (click)="showAddForm = true">Add New Property</button>
      </div>

      <div class="filters">
        <select [(ngModel)]="typeFilter" (change)="filterProperties()">
          <option value="">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </select>
        
        <select [(ngModel)]="statusFilter" (change)="filterProperties()">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="needs-attention">Needs Attention</option>
        </select>
      </div>

      <div class="properties-grid">
        <div class="property-card" *ngFor="let property of filteredProperties">
          <div class="property-header">
            <h3>{{ property.name }}</h3>
            <span class="status-badge" [class]="'status-' + property.status">
              {{ property.status | titlecase }}
            </span>
          </div>
          
          <div class="property-details">
            <div class="detail-row">
              <span class="label">Address:</span>
              <span>{{ property.address }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Type:</span>
              <span>{{ property.type | titlecase }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Service:</span>
              <span>{{ property.maintenanceType | titlecase }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Frequency:</span>
              <span>{{ property.frequency | titlecase }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Priority:</span>
              <span class="priority" [class]="'priority-' + property.priority">
                {{ property.priority | titlecase }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Last Service:</span>
              <span>{{ property.lastMaintenance | date:'mediumDate' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Next Scheduled:</span>
              <span>{{ property.nextScheduled | date:'mediumDate' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Est. Duration:</span>
              <span>{{ property.estimatedDuration }} minutes</span>
            </div>
          </div>

          <div class="property-actions">
            <button class="btn btn-secondary" (click)="editProperty(property)">Edit</button>
            <button class="btn btn-primary" (click)="scheduleService(property)">Schedule</button>
            <button class="btn btn-danger" (click)="deleteProperty(property.id)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Add Property Form -->
      <div class="modal" *ngIf="showAddForm">
        <div class="modal-content">
          <h3>Add New Property</h3>
          <form (ngSubmit)="addProperty()" #propertyForm="ngForm">
            <div class="form-group">
              <label>Name</label>
              <input type="text" [(ngModel)]="newProperty.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Address</label>
              <input type="text" [(ngModel)]="newProperty.address" name="address" required>
            </div>
            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="newProperty.type" name="type" required>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div class="form-group">
              <label>Maintenance Type</label>
              <select [(ngModel)]="newProperty.maintenanceType" name="maintenanceType" required>
                <option value="landscaping">Landscaping</option>
                <option value="cleaning">Cleaning</option>
                <option value="security">Security</option>
                <option value="general">General</option>
              </select>
            </div>
            <div class="form-group">
              <label>Frequency</label>
              <select [(ngModel)]="newProperty.frequency" name="frequency" required>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select [(ngModel)]="newProperty.priority" name="priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estimated Duration (minutes)</label>
              <input type="number" [(ngModel)]="newProperty.estimatedDuration" name="duration" required>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelAdd()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!propertyForm.valid">Add Property</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .properties {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
    }

    .filters select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
    }

    .properties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .property-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .property-card:hover {
      transform: translateY(-2px);
    }

    .property-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }

    .property-header h3 {
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
      color: #065f46;
    }

    .status-inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-needs-attention {
      background: #fef3c7;
      color: #92400e;
    }

    .property-details {
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
      min-width: 120px;
    }

    .priority {
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    }

    .priority-high {
      background: #fee2e2;
      color: #991b1b;
    }

    .priority-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .priority-low {
      background: #d1fae5;
      color: #065f46;
    }

    .property-actions {
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
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-danger {
      background: #dc2626;
      color: white;
    }

    .btn-danger:hover {
      background: #b91c1c;
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
      max-height: 90vh;
      overflow-y: auto;
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

    .form-group input, .form-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #2563eb;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .properties-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PropertiesComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  typeFilter = '';
  statusFilter = '';
  showAddForm = false;
  
  newProperty: Partial<Property> = {
    name: '',
    address: '',
    type: 'residential',
    maintenanceType: 'landscaping',
    frequency: 'weekly',
    priority: 'medium',
    estimatedDuration: 60,
    status: 'active'
  };

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.propertyService.getProperties().subscribe(properties => {
      this.properties = properties;
      this.filteredProperties = properties;
    });
  }

  filterProperties() {
    this.filteredProperties = this.properties.filter(property => {
      const typeMatch = !this.typeFilter || property.type === this.typeFilter;
      const statusMatch = !this.statusFilter || property.status === this.statusFilter;
      return typeMatch && statusMatch;
    });
  }

  addProperty() {
    if (this.newProperty.name && this.newProperty.address && this.newProperty.estimatedDuration) {
      const property: Property = {
        id: Date.now().toString(),
        name: this.newProperty.name,
        address: this.newProperty.address,
        coordinates: { lat: 40.7128, lng: -74.0060 }, // Default coordinates
        type: this.newProperty.type as any,
        maintenanceType: this.newProperty.maintenanceType as any,
        frequency: this.newProperty.frequency as any,
        priority: this.newProperty.priority as any,
        estimatedDuration: this.newProperty.estimatedDuration,
        status: 'active',
        lastMaintenance: new Date(),
        nextScheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next week
      };

      this.propertyService.addProperty(property);
      this.cancelAdd();
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newProperty = {
      name: '',
      address: '',
      type: 'residential',
      maintenanceType: 'landscaping',
      frequency: 'weekly',
      priority: 'medium',
      estimatedDuration: 60,
      status: 'active'
    };
  }

  editProperty(property: Property) {
    console.log('Edit property:', property);
  }

  scheduleService(property: Property) {
    console.log('Schedule service for:', property);
  }

  deleteProperty(id: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(id);
    }
  }
}