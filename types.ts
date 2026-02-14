export enum ViewState {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  MONITOR = 'MONITOR',
  ALERTS = 'ALERTS',
  INTERSECTION_DETAIL = 'INTERSECTION_DETAIL',
  STATS = 'STATS',
  DEVICE_MANAGEMENT = 'DEVICE_MANAGEMENT',
  SYSTEM_SETTINGS = 'SYSTEM_SETTINGS'
}

export interface Intersection {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  trafficFlow: number; // vehicles per hour
  avgSpeed: number; // km/h
  congestionLevel: 'low' | 'moderate' | 'heavy' | 'severe';
  signalPhase: string;
  countDown: number;
}

export interface Alert {
  id: string;
  type: 'accident' | 'congestion' | 'device' | 'emergency';
  title: string;
  description: string;
  time: string;
  location: string;
  status: 'pending' | 'processing' | 'resolved';
}

export interface TrafficStats {
  onlineRate: number;
  onlineStatus: 'normal' | 'warning';
  congestionIndex: number;
  congestionStatus: string;
  pendingAlerts: number;
  emergencyRequests: number;
  totalIntersections: number;
}