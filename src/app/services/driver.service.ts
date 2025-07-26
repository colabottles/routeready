import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Driver, DriverSchedule } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private driversSubject = new BehaviorSubject<Driver[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '(555) 123-4567',
      licenseNumber: 'DL123456',
      status: 'active',
      currentLocation: 'Office',
      totalMileage: 15750,
      lastActivity: new Date(),
      vehicleAssigned: 'Vehicle-001'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '(555) 987-6543',
      licenseNumber: 'DL789012',
      status: 'on-route',
      currentLocation: 'Downtown District',
      totalMileage: 12340,
      lastActivity: new Date(),
      vehicleAssigned: 'Vehicle-002'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.w@company.com',
      phone: '(555) 456-7890',
      licenseNumber: 'DL345678',
      status: 'active',
      currentLocation: 'Office',
      totalMileage: 18920,
      lastActivity: new Date(),
      vehicleAssigned: 'Vehicle-003'
    }
  ]);

  private schedulesSubject = new BehaviorSubject<DriverSchedule[]>([
    {
      id: '1',
      driverId: '1',
      date: new Date(),
      startTime: '08:00',
      endTime: '16:00',
      routes: ['route-1', 'route-2'],
      status: 'in-progress'
    },
    {
      id: '2',
      driverId: '2',
      date: new Date(),
      startTime: '07:30',
      endTime: '15:30',
      routes: ['route-3'],
      status: 'in-progress'
    }
  ]);

  getDrivers(): Observable<Driver[]> {
    return this.driversSubject.asObservable();
  }

  getSchedules(): Observable<DriverSchedule[]> {
    return this.schedulesSubject.asObservable();
  }

  addDriver(driver: Driver): void {
    const drivers = this.driversSubject.value;
    drivers.push(driver);
    this.driversSubject.next(drivers);
  }

  updateDriver(updatedDriver: Driver): void {
    const drivers = this.driversSubject.value;
    const index = drivers.findIndex(d => d.id === updatedDriver.id);
    if (index !== -1) {
      drivers[index] = updatedDriver;
      this.driversSubject.next(drivers);
    }
  }

  addSchedule(schedule: DriverSchedule): void {
    const schedules = this.schedulesSubject.value;
    schedules.push(schedule);
    this.schedulesSubject.next(schedules);
  }
}