import React from 'react';
import { ArrowLeft, BarChart2, PieChart, TrendingUp, Calendar, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface StatsViewProps {
  onBack: () => void;
}

// Mock data for charts
const flowData = [
  { time: '00:00', value: 120 },
  { time: '04:00', value: 50 },
  { time: '08:00', value: 850 },
  { time: '12:00', value: 600 },
  { time: '16:00', value: 900 },
  { time: '20:00', value: 400 },
  { time: '23:59', value: 150 },
];

const violationData = [
    { name: '闯红灯', value: 45 },
    { name: '超速', value: 120 },
    { name: '违停', value: 80 },
    { name: '逆行', value: 30 },
];

const weeklyData = [
  { day: '周一', value: 3200 },
  { day: '周二', value: 3500 },
  { day: '周三', value: 3100 },
  { day: '周四', value: 3800 },
  { day: '周五', value: 4200 },
  { day: '周六', value: 2500 },
  { day: '周日', value: 2100 },
];

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export const StatsView: React.FC<StatsViewProps> = ({ onBack }) => {
  return (
    <div className="pb-24 pt-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="px-5 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-1 -ml-1">
                <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <div>
                <h1 className="text-lg font-bold text-slate-800">数据统计</h1>
                <p className="text-xs text-slate-400">交通大数据分析</p>
            </div>
        </div>
        <div className="flex space-x-2">
            <button className="bg-white p-2 rounded-full shadow-sm text-slate-500">
                <Download className="w-5 h-5" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-sm text-slate-500">
                <Calendar className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Total Traffic Card */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-blue-100 text-sm">今日车流量</p>
                    <h2 className="text-3xl font-bold mt-1">128,432</h2>
                </div>
                <div className="bg-white/20 p-2 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-100">
                <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold text-xs">+12.5%</span>
                <span className="opacity-80">较昨日</span>
            </div>
        </div>

        {/* Traffic Trend Chart */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                24小时流量趋势
            </h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={flowData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                        <Tooltip 
                             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                             cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Violation Stats */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-orange-500" />
                今日违章类型分布
            </h3>
            <div className="space-y-4">
                {violationData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 w-24">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-sm text-slate-600">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 flex-1">
                            <div className="h-2 rounded-full bg-slate-100 flex-1 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(item.value / 150) * 100}%`, backgroundColor: COLORS[index] }}></div>
                            </div>
                            <span className="text-xs font-bold text-slate-800 w-8 text-right">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Weekly Analysis */}
         <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <BarChart2 className="w-4 h-4 mr-2 text-purple-500" />
                本周流量分析
            </h3>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 4, 4]} fill="#8b5cf6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};