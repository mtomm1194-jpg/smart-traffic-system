import React, { useState } from 'react';
import { ArrowLeft, Search, Battery, Wifi, AlertCircle, CheckCircle2, MoreVertical, Server, Filter } from 'lucide-react';

interface DeviceManagementViewProps {
  onBack: () => void;
}

const DEVICES = [
  { id: 'VT-001', name: '语音终端 VT-001', location: '中山路与人民路交叉口', status: 'online', battery: 85, type: 'voice' },
  { id: 'CAM-012', name: '监控摄像头 A-12', location: '建国路全段', status: 'online', battery: 100, type: 'camera' },
  { id: 'SIG-003', name: '信号灯控制箱 B-03', location: '五一广场', status: 'offline', battery: 0, type: 'signal' },
  { id: 'SEN-008', name: '流量传感器 S-08', location: '建设路', status: 'warning', battery: 12, type: 'sensor' },
  { id: 'VT-002', name: '语音终端 VT-002', location: '解放路口', status: 'online', battery: 92, type: 'voice' },
  { id: 'CAM-015', name: '监控摄像头 C-15', location: '人民路东', status: 'online', battery: 98, type: 'camera' },
];

export const DeviceManagementView: React.FC<DeviceManagementViewProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDevices = DEVICES.filter(d => 
    d.name.includes(searchTerm) || d.location.includes(searchTerm) || d.id.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'online': return 'text-green-500 bg-green-50';
          case 'offline': return 'text-slate-400 bg-slate-100';
          case 'warning': return 'text-orange-500 bg-orange-50';
          default: return 'text-slate-500 bg-slate-100';
      }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
          case 'online': return <CheckCircle2 className="w-4 h-4" />;
          case 'offline': return <Wifi className="w-4 h-4" />;
          case 'warning': return <AlertCircle className="w-4 h-4" />;
          default: return <Server className="w-4 h-4" />;
      }
  };

  return (
    <div className="pb-24 pt-4 bg-slate-50 min-h-screen">
      <div className="px-5 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-1 -ml-1">
                <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <div>
                <h1 className="text-lg font-bold text-slate-800">设备管理</h1>
                <p className="text-xs text-slate-400">共 {DEVICES.length} 个设备</p>
            </div>
        </div>
        <button className="p-2 bg-white rounded-full shadow-sm text-slate-400">
            <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="px-5 mb-6">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="搜索设备名称、ID或位置" 
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      <div className="px-5 space-y-3">
          {filteredDevices.map(device => (
              <div key={device.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(device.status)}`}>
                          <Server className="w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="text-sm font-bold text-slate-800">{device.name}</h3>
                          <div className="flex items-center mt-1 space-x-2">
                              <span className="text-xs text-slate-400">{device.id}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-400">{device.location}</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                      <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${getStatusColor(device.status)}`}>
                          {getStatusIcon(device.status)}
                          <span>{device.status === 'online' ? '在线' : device.status === 'offline' ? '离线' : '异常'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-400">
                          <Battery className="w-3 h-3" />
                          <span className="text-xs">{device.battery}%</span>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};