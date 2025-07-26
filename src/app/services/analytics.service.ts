import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AnalyticsData {
  totalDrivers: number;
  activeDrivers: number;
  totalProperties: number;
  completedToday: number;
  totalMileage: number;
  fuelEfficiency: number;
  averageCompletionTime: number;
  routeOptimization: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private analyticsSubject = new BehaviorSubject<AnalyticsData>({
    totalDrivers: 3,
    activeDrivers: 2,
    totalProperties: 3,
    completedToday: 5,
    totalMileage: 47010,
    fuelEfficiency: 85.5,
    averageCompletionTime: 125,
    routeOptimization: 84.3
  });

  getAnalytics(): Observable<AnalyticsData> {
    return this.analyticsSubject.asObservable();
  }

  updateAnalytics(data: Partial<AnalyticsData>): void {
    const current = this.analyticsSubject.value;
    this.analyticsSubject.next({ ...current, ...data });
  }
}