import React from 'react';
import { ViewState, Alert } from '../types';
import { useTrafficStats, useAlerts } from '../hooks/useSupabase';
import { StatCard } from '../components/StatCard';
import { FeatureCard } from '../components/FeatureCard';
import { Bell, Map, Settings, Sliders, Ambulance, TriangleAlert, Server, Activity, ArrowRight, FileText, CheckCircle2, Car, Siren } from 'lucide-react';

interface HomeViewProps {
  onChangeView: (view: ViewState) => void;
  onNavigateToAlerts?: (status?: 'all' | 'pending' | 'resolved', category?: Alert['type'] | 'all') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onChangeView, onNavigateToAlerts }) => {
  const { stats } = useTrafficStats();
  const { alerts } = useAlerts();

  // Calculate dynamic counts from real data
  const pendingCount = alerts.filter(a => a.status === 'pending' || a.status === 'processing').length;
  const emergencyCount = alerts.filter(a => a.type === 'emergency').length;

  const getIconForAlert = (alert: Alert) => {
    if (alert.status === 'resolved') return <CheckCircle2 className="w-6 h-6 text-white" />;
    switch (alert.type) {
      case 'accident': return <Car className="w-5 h-5 text-white" />;
      case 'emergency': return <Siren className="w-5 h-5 text-white" />;
      case 'device': return <Server className="w-5 h-5 text-white" />;
      case 'congestion': default: return <TriangleAlert className="w-5 h-5 text-white" />;
    }
  };

  const getBgColorForIcon = (alert: Alert) => {
    if (alert.status === 'resolved') return 'bg-green-500';
    switch (alert.type) {
      case 'accident': return 'bg-red-500';
      case 'emergency': return 'bg-orange-500';
      case 'device': return 'bg-blue-500';
      default: return 'bg-orange-500';
    }
  };

  return (
    <div className="pb-24 pt-4 px-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <div className="flex flex-col space-y-0.5">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-2 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">智畅通</h1>
            <p className="text-xs text-slate-400">智能交通管理系统</p>
          </div>
        </div>
        <div
          className="relative p-2 bg-white rounded-full shadow-sm cursor-pointer active:scale-95 transition-transform"
          onClick={() => onChangeView(ViewState.ALERTS)}
        >
          <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          <Bell className="w-6 h-6 text-slate-600" />
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          title="设备在线率"
          value={stats.onlineRate}
          unit="%"
          statusText="正常"
          statusColor="green"
          icon={<Server className="w-5 h-5 text-green-500" />}
        />
        <StatCard
          title="拥堵指数"
          value={stats.congestionIndex}
          statusText={stats.congestionStatus}
          statusColor="orange"
          icon={<Activity className="w-5 h-5 text-orange-500" />}
        />
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center h-24 cursor-pointer active:bg-slate-50 transition-colors"
          onClick={() => onNavigateToAlerts && onNavigateToAlerts('pending', 'all')}
        >
          <span className="text-red-500 font-bold text-xl">{pendingCount}</span>
          <span className="text-slate-400 text-xs mt-1">待处理告警</span>
        </div>
        <div
          className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center h-24 cursor-pointer active:bg-slate-50 transition-colors"
          onClick={() => onNavigateToAlerts && onNavigateToAlerts('all', 'emergency')}
        >
          <span className="text-orange-500 font-bold text-xl">{emergencyCount}</span>
          <span className="text-slate-400 text-xs mt-1">紧急请求</span>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center justify-center h-24">
          <span className="text-blue-500 font-bold text-xl">{stats.totalIntersections}</span>
          <span className="text-slate-400 text-xs mt-1">路口总数</span>
        </div>
      </div>

      {/* Core Features */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">核心功能</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <FeatureCard
          title="实时监控"
          subtitle="查看车流热力图"
          icon={<Map className="w-6 h-6" />}
          iconBg="bg-blue-500"
          bgColor="bg-blue-50"
          onClick={() => onChangeView(ViewState.MONITOR)}
        />
        <FeatureCard
          title="远程控制"
          subtitle="信号灯配时管理"
          icon={<Sliders className="w-6 h-6" />}
          iconBg="bg-indigo-500"
        />
        <FeatureCard
          title="紧急车辆"
          subtitle="优先通行请求"
          icon={<Ambulance className="w-6 h-6" />}
          iconBg="bg-red-500"
          bgColor="bg-red-50"
          onClick={() => onNavigateToAlerts && onNavigateToAlerts('all', 'emergency')}
        />
        <FeatureCard
          title="告警中心"
          subtitle="查看系统告警"
          icon={<TriangleAlert className="w-6 h-6" />}
          iconBg="bg-orange-500"
          onClick={() => onChangeView(ViewState.ALERTS)}
        />
      </div>

      {/* Quick Actions (Scrollable horizontal or grid) */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">快速操作</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center cursor-pointer active:bg-slate-50 active:scale-95 transition-all"
          onClick={() => onChangeView(ViewState.STATS)}
        >
          <div className="w-10 h-10 bg-sky-400 rounded-xl flex items-center justify-center text-white mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-600">数据统计</span>
        </div>
        <div
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center cursor-pointer active:bg-slate-50 active:scale-95 transition-all"
          onClick={() => onChangeView(ViewState.DEVICE_MANAGEMENT)}
        >
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white mb-2">
            <Server className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-600">设备管理</span>
        </div>
        <div
          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center cursor-pointer active:bg-slate-50 active:scale-95 transition-all"
          onClick={() => onChangeView(ViewState.SYSTEM_SETTINGS)}
        >
          <div className="w-10 h-10 bg-slate-500 rounded-xl flex items-center justify-center text-white mb-2">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-600">系统设置</span>
        </div>
      </div>

      {/* Recent Activity / Updates */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">最新动态</h2>
        <button
          className="text-xs text-blue-500 font-medium"
          onClick={() => onChangeView(ViewState.ALERTS)}
        >
          查看全部
        </button>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 3).map(alert => (
          <div
            key={alert.id}
            className="bg-white p-4 rounded-2xl shadow-sm flex items-start space-x-3 active:scale-95 transition-transform cursor-pointer"
            onClick={() => onNavigateToAlerts && onNavigateToAlerts(
              alert.status === 'processing' ? 'pending' : (alert.status as any),
              alert.type
            )}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getBgColorForIcon(alert)}`}>
              {getIconForAlert(alert)}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{alert.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};