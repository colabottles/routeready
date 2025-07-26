export interface ActivityLog {
  id: string;
  driverId: string;
  timestamp: Date;
  activity: 'departure' | 'arrival' | 'property-visit' | 'maintenance-complete' | 'equipment-use';
  location: string;
  mileage?: number;
  equipment?: string;
  notes?: string;
  duration?: number;
}

export interface EquipmentUsage {
  id: string;
  driverId: string;
  equipmentId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  propertyId: string;
  condition: 'good' | 'fair' | 'needs-repair';
}