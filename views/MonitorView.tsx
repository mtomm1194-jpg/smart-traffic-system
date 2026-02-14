import React from 'react';
import { ViewState, Intersection } from '../types';
import { ArrowLeft, MapPin, Gauge, Video, Signal } from 'lucide-react';
import { useIntersections } from '../hooks/useSupabase';

interface MonitorViewProps {
    onBack: () => void;
    onDetail: () => void;
}

export const MonitorView: React.FC<MonitorViewProps> = ({ onBack, onDetail }) => {
    const { intersections } = useIntersections();

    // Calculate stats
    const totalIntersections = intersections.length;
    const avgSpeed = totalIntersections > 0
        ? Math.round(intersections.reduce((acc, curr) => acc + curr.avgSpeed, 0) / totalIntersections)
        : 0;

    // Mock light status for now as we don't have this data structure yet
    const greenCount = Math.round(totalIntersections * 0.7);
    const yellowCount = Math.round(totalIntersections * 0.2);
    const redCount = totalIntersections - greenCount - yellowCount;

    // Filter abnormal intersections (warning status or severe/heavy congestion)
    const abnormalIntersections = intersections.filter(
        i => i.status === 'warning' || i.congestionLevel === 'heavy' || i.congestionLevel === 'severe'
    );

    return (
        <div className="pb-24 pt-4 bg-slate-50 min-h-screen">
            <div className="px-5 mb-4 flex items-center">
                <h1 className="text-xl font-bold text-slate-800">实时监控</h1>
            </div>

            {/* Map Placeholder Area (Heatmap) */}
            <div className="relative w-full h-64 bg-slate-200 mb-4 overflow-hidden group cursor-pointer" onClick={onDetail}>
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <div className="grid grid-cols-4 grid-rows-3 gap-8 opacity-20 w-full h-full p-4 transform -skew-x-12 scale-125">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-slate-400 h-full w-2 rounded-full"></div>
                        ))}
                        {[...Array(8)].map((_, i) => (
                            <div key={`h-${i}`} className="bg-slate-400 h-2 w-full rounded-full col-span-4 absolute top-1/4"></div>
                        ))}
                    </div>

                    {/* Heatmap Dots */}
                    <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-green-500 rounded-full blur-3xl opacity-40"></div>

                    {/* Simulated Road Junctions */}
                    <div className="absolute top-12 left-10 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
                </div>
            </div>

            <div className="px-5">
                {/* Heatmap Legend */}
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">车流热力图说明</h3>
                    <div className="flex justify-around">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mb-2"></div>
                            <span className="text-xs text-slate-500">畅通</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-orange-500 rounded-full mb-2"></div>
                            <span className="text-xs text-slate-500">中等</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-red-500 rounded-full mb-2"></div>
                            <span className="text-xs text-slate-500">拥堵</span>
                        </div>
                    </div>
                </div>

                {/* Real-time Stats */}
                <h3 className="text-lg font-bold text-slate-800 mb-3">实时数据概览</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-slate-400">监控路口数</span>
                            <MapPin className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{totalIntersections}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-slate-400">平均车速</span>
                            <Gauge className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-baseline">
                            <div className="text-2xl font-bold text-slate-800">{avgSpeed}</div>
                            <span className="text-sm font-bold text-slate-800 ml-0.5">km/h</span>
                        </div>
                    </div>
                </div>

                {/* Traffic Light Status */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center">
                        <span className="text-green-500 font-bold text-xl">{greenCount}</span>
                        <span className="text-xs text-slate-400 mt-1">绿灯路口</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center">
                        <span className="text-orange-500 font-bold text-xl">{yellowCount}</span>
                        <span className="text-xs text-slate-400 mt-1">黄灯路口</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl shadow-sm flex flex-col items-center">
                        <span className="text-red-500 font-bold text-xl">{redCount}</span>
                        <span className="text-xs text-slate-400 mt-1">红灯路口</span>
                    </div>
                </div>

                {/* Abnormal Intersections List */}
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-slate-800">异常路口</h3>
                    <span className="text-xs text-blue-500">查看全部</span>
                </div>

                <div className="space-y-3">
                    {abnormalIntersections.length === 0 ? (
                        <div className="bg-white p-4 rounded-2xl shadow-sm text-center text-slate-400 text-sm">
                            暂无异常路口
                        </div>
                    ) : (
                        abnormalIntersections.map(intersection => (
                            <div key={intersection.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between" onClick={onDetail}>
                                <div className="flex items-start space-x-3">
                                    <div className={`w-10 h-10 ${intersection.status === 'warning' ? 'bg-red-500' : 'bg-orange-500'} rounded-xl flex items-center justify-center shrink-0`}>
                                        {intersection.status === 'warning' ? <Video className="w-5 h-5 text-white" /> : <Signal className="w-5 h-5 text-white" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{intersection.name}</h4>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {intersection.status === 'warning' ? '设备离线' : `${intersection.congestionLevel === 'severe' ? '严拥堵' : '拥堵'} · 平均车速 ${intersection.avgSpeed}km/h`}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-xs font-medium text-blue-500 px-3 py-1.5 bg-blue-50 rounded-lg">查看</button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};