export interface Property {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'residential' | 'commercial' | 'industrial';
  maintenanceType: 'landscaping' | 'cleaning' | 'security' | 'general';
  frequency: 'daily' | 'weekly' | 'monthly';
  priority: 'high' | 'medium' | 'low';
  lastMaintenance: Date;
  nextScheduled: Date;
  estimatedDuration: number; // in minutes
  status: 'active' | 'inactive' | 'needs-attention';
}