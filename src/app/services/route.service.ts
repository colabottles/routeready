import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Route, RouteOptimization } from '../models/route.model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private routesSubject = new BehaviorSubject<Route[]>([
    {
      id: 'route-1',
      name: 'Downtown Circuit',
      properties: ['1', '2'],
      estimatedDuration: 180,
      distance: 25.5,
      optimized: true,
      createdDate: new Date('2025-01-10'),
      lastUsed: new Date(),
      efficiency: 0.87
    },
    {
      id: 'route-2',
      name: 'Industrial Zone',
      properties: ['3'],
      estimatedDuration: 120,
      distance: 15.2,
      optimized: true,
      createdDate: new Date('2025-01-12'),
      lastUsed: new Date(),
      efficiency: 0.92
    },
    {
      id: 'route-3',
      name: 'Residential Area',
      properties: ['2'],
      estimatedDuration: 90,
      distance: 12.8,
      optimized: false,
      createdDate: new Date('2025-01-15'),
      lastUsed: new Date(),
      efficiency: 0.74
    }
  ]);

  getRoutes(): Observable<Route[]> {
    return this.routesSubject.asObservable();
  }

  optimizeRoute(routeId: string): RouteOptimization {
    // Simulate route optimization
    return {
      originalRoute: ['1', '2', '3'],
      optimizedRoute: ['1', '3', '2'],
      distanceSaved: 3.2,
      timeSaved: 15,
      fuelSaved: 12.5
    };
  }

  createRoute(route: Route): void {
    const routes = this.routesSubject.value;
    routes.push(route);
    this.routesSubject.next(routes);
  }

  updateRoute(updatedRoute: Route): void {
    const routes = this.routesSubject.value;
    const index = routes.findIndex(r => r.id === updatedRoute.id);
    if (index !== -1) {
      routes[index] = updatedRoute;
      this.routesSubject.next(routes);
    }
  }
}