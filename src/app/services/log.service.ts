import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityLog, EquipmentUsage } from '../models/log.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logsSubject = new BehaviorSubject<ActivityLog[]>([
    {
      id: '1',
      driverId: '1',
      timestamp: new Date(),
      activity: 'departure',
      location: 'Office',
      mileage: 15750,
      notes: 'Starting route 1'
    },
    {
      id: '2',
      driverId: '2',
      timestamp: new Date(Date.now() - 3600000),
      activity: 'property-visit',
      location: 'Sunset Plaza',
      mileage: 12340,
      equipment: 'Lawn Mower',
      notes: 'Landscaping maintenance completed'
    },
    {
      id: '3',
      driverId: '1',
      timestamp: new Date(Date.now() - 7200000),
      activity: 'maintenance-complete',
      location: 'Oak Grove Apartments',
      mileage: 15740,
      duration: 90,
      notes: 'Cleaning service completed'
    }
  ]);

  private equipmentUsageSubject = new BehaviorSubject<EquipmentUsage[]>([
    {
      id: '1',
      driverId: '1',
      equipmentId: 'mower-01',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 2700000),
      duration: 60,
      propertyId: '1',
      condition: 'good'
    }
  ]);

  getLogs(): Observable<ActivityLog[]> {
    return this.logsSubject.asObservable();
  }

  getEquipmentUsage(): Observable<EquipmentUsage[]> {
    return this.equipmentUsageSubject.asObservable();
  }

  addLog(log: ActivityLog): void {
    const logs = this.logsSubject.value;
    logs.unshift(log);
    this.logsSubject.next(logs);
  }

  addEquipmentUsage(usage: EquipmentUsage): void {
    const usages = this.equipmentUsageSubject.value;
    usages.unshift(usage);
    this.equipmentUsageSubject.next(usages);
  }
}