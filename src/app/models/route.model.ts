export interface Route {
  id: string;
  name: string;
  properties: string[];
  estimatedDuration: number;
  distance: number;
  optimized: boolean;
  createdDate: Date;
  lastUsed: Date;
  efficiency: number;
}

export interface RouteOptimization {
  originalRoute: string[];
  optimizedRoute: string[];
  distanceSaved: number;
  timeSaved: number;
  fuelSaved: number;
}