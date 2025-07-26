import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { PropertyService } from '../../services/property.service';
import { Route, RouteOptimization } from '../../models/route.model';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="routes">
      <div class="header">
        <h2>Route Management</h2>
        <button class="btn btn-primary" (click)="showCreateForm = true">Create New Route</button>
      </div>

      <div class="routes-grid">
        <div class="route-card" *ngFor="let route of routes">
          <div class="route-header">
            <h3>{{ route.name }}</h3>
            <div class="route-badges">
              <span class="efficiency-badge" [class]="getEfficiencyClass(route.efficiency)">
                {{ route.efficiency * 100 | number:'1.0-0' }}% Efficient
              </span>
              <span class="optimized-badge" [class]="route.optimized ? 'optimized' : 'not-optimized'">
                {{ route.optimized ? 'Optimized' : 'Not Optimized' }}
              </span>
            </div>
          </div>
          
          <div class="route-details">
            <div class="detail-row">
              <span class="label">Properties:</span>
              <span>{{ route.properties.length }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Distance:</span>
              <span>{{ route.distance }} miles</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span>{{ route.estimatedDuration }} minutes</span>
            </div>
            <div class="detail-row">
              <span class="label">Created:</span>
              <span>{{ route.createdDate | date:'mediumDate' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Last Used:</span>
              <span>{{ route.lastUsed | date:'mediumDate' }}</span>
            </div>
          </div>

          <div class="route-actions">
            <button class="btn btn-secondary" (click)="viewRoute(route)">View Map</button>
            <button class="btn btn-primary" (click)="optimizeRoute(route)" [disabled]="route.optimized">
              Optimize
            </button>
            <button class="btn btn-success" (click)="assignRoute(route)">Assign</button>
          </div>
        </div>
      </div>

      <!-- Create Route Form -->
      <div class="modal" *ngIf="showCreateForm">
        <div class="modal-content">
          <h3>Create New Route</h3>
          <form (ngSubmit)="createRoute()" #routeForm="ngForm">
            <div class="form-group">
              <label>Route Name</label>
              <input type="text" [(ngModel)]="newRoute.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Select Properties</label>
              <div class="property-selection">
                <div class="property-item" *ngFor="let property of properties">
                  <input type="checkbox" 
                         [id]="property.id" 
                         [checked]="isPropertySelected(property.id)"
                         (change)="toggleProperty(property.id)">
                  <label [for]="property.id">{{ property.name }} - {{ property.address }}</label>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelCreate()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!routeForm.valid || newRoute.properties.length === 0">
                Create Route
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Route Optimization Results -->
      <div class="modal" *ngIf="showOptimizationResults">
        <div class="modal-content">
          <h3>Route Optimization Results</h3>
          <div class="optimization-results">
            <div class="savings-grid">
              <div class="savings-item">
                <h4>Distance Saved</h4>
                <span class="savings-value">{{ optimizationResults?.distanceSaved }} miles</span>
              </div>
              <div class="savings-item">
                <h4>Time Saved</h4>
                <span class="savings-value">{{ optimizationResults?.timeSaved }} minutes</span>
              </div>
              <div class="savings-item">
                <h4>Fuel Saved</h4>
                <span class="savings-value">{{ optimizationResults?.fuelSaved }}%</span>
              </div>
            </div>
            <div class="route-comparison">
              <div class="route-column">
                <h4>Original Route</h4>
                <div class="route-steps">
                  <div class="step" *ngFor="let propertyId of optimizationResults?.originalRoute">
                    {{ getPropertyName(propertyId) }}
                  </div>
                </div>
              </div>
              <div class="route-column">
                <h4>Optimized Route</h4>
                <div class="route-steps">
                  <div class="step optimized" *ngFor="let propertyId of optimizationResults?.optimizedRoute">
                    {{ getPropertyName(propertyId) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" (click)="cancelOptimization()">Cancel</button>
            <button class="btn btn-primary" (click)="applyOptimization()">Apply Optimization</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .routes {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .routes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .route-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .route-card:hover {
      transform: translateY(-2px);
    }

    .route-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }

    .route-header h3 {
      margin: 0;
      color: #1f2937;
    }

    .route-badges {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .efficiency-badge, .optimized-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
    }

    .efficiency-high { background: #d1fae5; color: #065f46; }
    .efficiency-medium { background: #fef3c7; color: #92400e; }
    .efficiency-low { background: #fee2e2; color: #991b1b; }

    .optimized { background: #d1fae5; color: #065f46; }
    .not-optimized { background: #fee2e2; color: #991b1b; }

    .route-details {
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

    .route-actions {
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .btn-success {
      background: #059669;
      color: white;
    }

    .btn-success:hover {
      background: #047857;
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
      max-width: 600px;
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

    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
    }

    .property-selection {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 10px;
    }

    .property-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 0;
    }

    .property-item input[type="checkbox"] {
      width: auto;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .optimization-results {
      margin-bottom: 20px;
    }

    .savings-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .savings-item {
      text-align: center;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .savings-item h4 {
      margin: 0 0 10px 0;
      color: #6b7280;
      font-size: 14px;
    }

    .savings-value {
      font-size: 24px;
      font-weight: bold;
      color: #059669;
    }

    .route-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .route-column h4 {
      margin: 0 0 10px 0;
      color: #1f2937;
    }

    .route-steps {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .step {
      padding: 8px 12px;
      background: #f3f4f6;
      border-radius: 4px;
      font-size: 14px;
    }

    .step.optimized {
      background: #d1fae5;
      color: #065f46;
    }

    @media (max-width: 768px) {
      .routes-grid {
        grid-template-columns: 1fr;
      }
      
      .route-badges {
        flex-direction: row;
        gap: 10px;
      }
    }
  `]
})
export class RoutesComponent implements OnInit {
  routes: Route[] = [];
  properties: Property[] = [];
  showCreateForm = false;
  showOptimizationResults = false;
  optimizationResults: RouteOptimization | null = null;
  currentOptimizingRoute: Route | null = null;
  
  newRoute = {
    name: '',
    properties: [] as string[]
  };

  constructor(
    private routeService: RouteService,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    this.routeService.getRoutes().subscribe(routes => {
      this.routes = routes;
    });

    this.propertyService.getProperties().subscribe(properties => {
      this.properties = properties;
    });
  }

  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 0.8) return 'efficiency-high';
    if (efficiency >= 0.6) return 'efficiency-medium';
    return 'efficiency-low';
  }

  isPropertySelected(propertyId: string): boolean {
    return this.newRoute.properties.includes(propertyId);
  }

  toggleProperty(propertyId: string) {
    const index = this.newRoute.properties.indexOf(propertyId);
    if (index > -1) {
      this.newRoute.properties.splice(index, 1);
    } else {
      this.newRoute.properties.push(propertyId);
    }
  }

  createRoute() {
    if (this.newRoute.name && this.newRoute.properties.length > 0) {
      const route: Route = {
        id: Date.now().toString(),
        name: this.newRoute.name,
        properties: [...this.newRoute.properties],
        estimatedDuration: this.newRoute.properties.length * 60, // Estimate 60 min per property
        distance: this.newRoute.properties.length * 5, // Estimate 5 miles per property
        optimized: false,
        createdDate: new Date(),
        lastUsed: new Date(),
        efficiency: 0.7
      };

      this.routeService.createRoute(route);
      this.cancelCreate();
    }
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newRoute = {
      name: '',
      properties: []
    };
  }

  viewRoute(route: Route) {
    console.log('View route on map:', route);
  }

  optimizeRoute(route: Route) {
    this.currentOptimizingRoute = route;
    this.optimizationResults = this.routeService.optimizeRoute(route.id);
    this.showOptimizationResults = true;
  }

  applyOptimization() {
    if (this.currentOptimizingRoute && this.optimizationResults) {
      const updatedRoute = {
        ...this.currentOptimizingRoute,
        optimized: true,
        properties: [...this.optimizationResults.optimizedRoute],
        efficiency: Math.min(0.95, this.currentOptimizingRoute.efficiency + 0.15)
      };
      
      this.routeService.updateRoute(updatedRoute);
      this.cancelOptimization();
    }
  }

  cancelOptimization() {
    this.showOptimizationResults = false;
    this.optimizationResults = null;
    this.currentOptimizingRoute = null;
  }

  assignRoute(route: Route) {
    console.log('Assign route to driver:', route);
  }

  getPropertyName(propertyId: string): string {
    const property = this.properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown Property';
  }
}