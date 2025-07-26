export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'on-route';
  currentLocation?: string;
  totalMileage: number;
  lastActivity: Date;
  vehicleAssigned?: string;
}

export interface DriverSchedule {
  id: string;
  driverId: string;
  date: Date;
  startTime: string;
  endTime: string;
  routes: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}