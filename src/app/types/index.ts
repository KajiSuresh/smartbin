export interface Truck {
  id: string;
  name: string;
  driver: string;
  license_plate: string;
  status: 'active' | 'inactive' | 'maintenance';
  current_location: {
    lat: number;
    lng: number;
  };
  fuel_level: number;
  last_maintenance: string;
  next_maintenance: string;
  total_distance: number;
}

export interface TruckLocation {
  id: string;
  truck_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;
  heading: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  license_number: string;
  status: 'available' | 'on_duty' | 'off_duty';
}