import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private propertiesSubject = new BehaviorSubject<Property[]>([
    {
      id: '1',
      name: 'Sunset Plaza',
      address: '123 Main St, City, State 12345',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      type: 'commercial',
      maintenanceType: 'landscaping',
      frequency: 'weekly',
      priority: 'high',
      lastMaintenance: new Date('2025-01-15'),
      nextScheduled: new Date('2025-01-22'),
      estimatedDuration: 120,
      status: 'active'
    },
    {
      id: '2',
      name: 'Oak Grove Apartments',
      address: '456 Oak Ave, City, State 12345',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      type: 'residential',
      maintenanceType: 'cleaning',
      frequency: 'daily',
      priority: 'medium',
      lastMaintenance: new Date('2025-01-20'),
      nextScheduled: new Date('2025-01-21'),
      estimatedDuration: 90,
      status: 'active'
    },
    {
      id: '3',
      name: 'Industrial Complex A',
      address: '789 Industrial Blvd, City, State 12345',
      coordinates: { lat: 40.6782, lng: -73.9442 },
      type: 'industrial',
      maintenanceType: 'security',
      frequency: 'daily',
      priority: 'high',
      lastMaintenance: new Date('2025-01-20'),
      nextScheduled: new Date('2025-01-21'),
      estimatedDuration: 60,
      status: 'needs-attention'
    }
  ]);

  getProperties(): Observable<Property[]> {
    return this.propertiesSubject.asObservable();
  }

  addProperty(property: Property): void {
    const properties = this.propertiesSubject.value;
    properties.push(property);
    this.propertiesSubject.next(properties);
  }

  updateProperty(updatedProperty: Property): void {
    const properties = this.propertiesSubject.value;
    const index = properties.findIndex(p => p.id === updatedProperty.id);
    if (index !== -1) {
      properties[index] = updatedProperty;
      this.propertiesSubject.next(properties);
    }
  }

  deleteProperty(id: string): void {
    const properties = this.propertiesSubject.value.filter(p => p.id !== id);
    this.propertiesSubject.next(properties);
  }
}