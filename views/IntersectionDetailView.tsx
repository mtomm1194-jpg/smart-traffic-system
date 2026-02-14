import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS, MOCK_INTERSECTION } from '../constants';
import { useIntersections } from '../hooks/useSupabase';

interface IntersectionDetailViewProps {
    onBack: () => void;
    intersectionId: string | null;
}

const data = [
    { time: '10:00', flow: 40 },
    { time: '10:15', flow: 70 },
    { time: '10:30', flow: 90 },
    { time: '10:45', flow: 80 },
    { time: '11:00', flow: 60 },
];

export const IntersectionDetailView: React.FC<IntersectionDetailViewProps> = ({ onBack, intersectionId }) => {
    const { intersections, loading } = useIntersections();

    // Find the selected intersection or fallback to the first one (or mock) if null/not found 
    // to avoid crashing if ID is invalid or list empty.
    const intersection = intersections.find(i => i.id === intersectionId) || MOCK_INTERSECTION;

    if (loading && intersections.length === 0) {
        return (
            <div className="pb-24 pt-4 bg-slate-50 min-h-screen flex items-center justify-center">
                <span className="text-slate-400">加载中...</span>
            </div>
        );
    }

    return (
        <div className="pb-24 pt-4 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="px-5 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="p-1 -ml-1">
                        <ArrowLeft className="w-6 h-6 text-slate-800" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">路口详情</h1>
                        <p className="text-xs text-slate-400">{intersection.name}</p>
                    </div>
                </div>
                <button className="bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-200">
                    远程控制
                </button>
            </div>

            <div className="px-5 space-y-4">
                {/* Basic Info Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-slate-800">基本信息</h3>
                        <div className={`w-8 h-8 rounded-full ${intersection.status === 'online' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center justify-center text-xs font-bold`}>
                            {intersection.status === 'online' ? '绿' : '红'}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">路口ID</span>
                            <span className="text-sm font-medium text-slate-800">{intersection.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">位置</span>
                            <span className="text-sm font-medium text-slate-800">{intersection.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">当前配时方案</span>
                            <span className="text-sm font-medium text-slate-800">智能动态配时</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">信号周期</span>
                            <span className="text-sm font-medium text-slate-800">120秒</span>
                        </div>
                    </div>
                </div>

                {/* Real-time Data Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm">
                    <h3 className="text-base font-bold text-slate-800 mb-6">实时交通数据</h3>

                    <div className="flex justify-between items-center mb-8 px-2">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-blue-500">{intersection.trafficFlow}</span>
                            <span className="text-[10px] text-slate-400 mt-1 text-center">车流量(辆/小时)</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-green-500">{intersection.avgSpeed}</span>
                            <span className="text-[10px] text-slate-400 mt-1 text-center">平均车速(km/h)</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-orange-500">{intersection.congestionLevel === 'severe' ? '95%' : intersection.congestionLevel === 'heavy' ? '80%' : '45%'}</span>
                            <span className="text-[10px] text-slate-400 mt-1 text-center">车道占有率</span>
                        </div>
                    </div>

                    <h4 className="text-sm text-slate-800 font-medium mb-4">近1小时车流量趋势</h4>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="flow" radius={[4, 4, 4, 4]} barSize={20}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#007bff" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Signal Status Visual (Screenshot 8 top right/middle) */}
                <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-base font-bold text-slate-800">当前状态</h3>
                            <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${intersection.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-xs ${intersection.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>{intersection.status === 'online' ? '在线' : '离线'}</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">当前配时方案</p>
                        <p className="text-sm font-medium text-slate-800 mb-2">智能动态配时方案</p>
                        <p className="text-xs text-slate-400">当前相位</p>
                        <p className="text-sm font-medium text-slate-800 mb-2">{intersection.signalPhase || '东西方向直行'}</p>
                        <p className="text-xs text-slate-400">剩余时间</p>
                        <p className="text-xl font-bold text-blue-500">{intersection.countDown || 0}秒</p>
                    </div>
                    {/* Traffic Light Visual */}
                    <div className="bg-slate-800 p-3 rounded-2xl flex flex-col space-y-2 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-red-900/50 border-2 border-slate-700"></div>
                        <div className="w-10 h-10 rounded-full bg-yellow-900/50 border-2 border-slate-700"></div>
                        <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                    </div>
                </div>

                {/* Scheme Selection */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50">
                        <h3 className="text-base font-bold text-slate-800">配时方案</h3>
                    </div>

                    <div className="p-2 space-y-1">
                        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">智能动态配时方案</h4>
                                <p className="text-xs text-slate-400 mt-0.5">基于实时车流自动调整</p>
                            </div>
                            <div className="flex items-center">
                                <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-md mr-2">当前</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="p-3 bg-white rounded-2xl flex justify-between items-center active:bg-slate-50">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">高峰时段方案</h4>
                                <p className="text-xs text-slate-400 mt-0.5">适用于早晚高峰时段</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>

                        <div className="p-3 bg-white rounded-2xl flex justify-between items-center active:bg-slate-50">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">平峰时段方案</h4>
                                <p className="text-xs text-slate-400 mt-0.5">适用于非高峰时段</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};