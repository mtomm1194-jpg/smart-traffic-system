import { Alert, Intersection, TrafficStats } from './types';
import { TriangleAlert, Car, Wrench, Siren } from 'lucide-react';

// Data derived from PDF "Project Overview" and Screenshots
export const MOCK_STATS: TrafficStats = {
  onlineRate: 98.5,
  onlineStatus: 'normal',
  congestionIndex: 62,
  congestionStatus: '轻度拥堵',
  pendingAlerts: 3,
  emergencyRequests: 1,
  totalIntersections: 128
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'accident',
    title: '中山路与人民路交叉口发生交通事故',
    description: '和平路与幸福路交叉口交通事故已处理完毕',
    location: '中山路与人民路交叉口',
    time: '2分钟前',
    status: 'pending'
  },
  {
    id: '2',
    type: 'emergency',
    title: '救护车优先通行请求已处理',
    description: '湘A-120XX 请求优先通行',
    location: '建设路全段',
    time: '5分钟前',
    status: 'resolved'
  },
  {
    id: '3',
    type: 'congestion',
    title: '异常拥堵告警',
    description: '建国路路段拥堵指数达到85，建议调整信号灯配时',
    location: '建国路全段',
    time: '8分钟前',
    status: 'processing'
  },
  {
    id: '4',
    type: 'device',
    title: '设备故障告警',
    description: '语音终端VT-003电量低告警已处理，已更换电池',
    location: '五一广场路口',
    time: '15分钟前',
    status: 'resolved'
  },
  {
    id: '5',
    type: 'device',
    title: '设备维护完成，系统恢复正常',
    description: '日常巡检完成',
    location: '系统',
    time: '10分钟前',
    status: 'resolved'
  },
  {
    id: '6',
    type: 'device',
    title: '信号灯控制箱温度过高',
    description: '建设路与解放路交叉口控制箱温度超过阈值',
    location: '建设路与解放路交叉口',
    time: '1分钟前',
    status: 'pending'
  }
];

export const MOCK_INTERSECTION: Intersection = {
  id: 'INT-001',
  name: '中山路与人民路交叉口',
  status: 'online',
  trafficFlow: 156,
  avgSpeed: 28,
  congestionLevel: 'moderate',
  signalPhase: '东西方向直行',
  countDown: 18
};

// Colors for chart/visuals
export const COLORS = {
  primary: '#3b82f6', // blue-500
  success: '#22c55e', // green-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  bgLight: '#f8fafc',
  cardBg: '#ffffff'
};