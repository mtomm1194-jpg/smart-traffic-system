import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Filter, MapPin, User, CheckCircle2, TriangleAlert, Siren, Car, Server } from 'lucide-react';
import { useAlerts } from '../hooks/useSupabase';
import { Alert } from '../types';

interface AlertsViewProps {
    onBack: () => void;
    initialStatusFilter?: 'all' | 'pending' | 'resolved';
    initialCategoryFilter?: Alert['type'] | 'all';
}

export const AlertsView: React.FC<AlertsViewProps> = ({
    onBack,
    initialStatusFilter = 'all',
    initialCategoryFilter = 'all'
}) => {
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>(initialStatusFilter);
    const [categoryFilter, setCategoryFilter] = useState<Alert['type'] | 'all'>(initialCategoryFilter);
    const { alerts, loading, refetch } = useAlerts(
        statusFilter !== 'all' ? statusFilter : undefined,
        categoryFilter !== 'all' ? categoryFilter : undefined
    );
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    // We are using server-side filtering via the hook, but for 'all' cases the hook returns everything, 
    // and if we change filters locally we might want client-side filtering if hook doesn't re-fetch immediately on every prop change.
    // Actually, the hook dependencies [statusFilter, categoryFilter] ensure it refetches.
    // However, `useAlerts` in my implementation uses params.
    // Let's use the local 'alerts' from hook which should obey the filters if I passed them.
    // Wait, I designed `useAlerts` to take arguments.

    // The hook implementation: useAlerts(statusFilter, categoryFilter).
    // So 'alerts' is already filtered by the server (or fallback logic).

    // We can just use 'alerts' directly.
    const filteredAlerts = alerts;

    const categoryOptions: { key: Alert['type'], label: string }[] = [
        { key: 'accident', label: '交通事故' },
        { key: 'device', label: '设备故障' },
        { key: 'congestion', label: '异常拥堵' },
        { key: 'emergency', label: '紧急' },
    ];

    const handleCategoryClick = (key: Alert['type']) => {
        if (categoryFilter === key) {
            setCategoryFilter('all'); // Toggle off if clicked again
        } else {
            setCategoryFilter(key);
        }
    };

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
        <div className="pb-24 pt-4 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="px-5 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="p-1 -ml-1">
                        <ArrowLeft className="w-6 h-6 text-slate-800" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">告警中心</h1>
                        <p className="text-xs text-slate-400">系统告警管理</p>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleRefresh}
                        className={`transition-transform ${isRefreshing || loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-5 h-5 text-slate-400" />
                    </button>
                    <Filter className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            <div className="px-5">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white py-3 rounded-2xl shadow-sm flex flex-col items-center">
                        <span className="text-slate-800 font-bold text-lg">{alerts.length}</span>
                        <span className="text-xs text-slate-400">当前列表</span>
                    </div>
                    {/* Note: To get true total counts while filtering, we might need separate queries or a separate stats hook. 
                For now, showing counts of currently visible items or just removing specific status counts if they are misleading when filtered.
                Or we can use useAlerts with 'all' to get stats, but that causes extra requests.
                Let's simplifying to just show what's loaded or maybe remove the breakdown if it's confusing.
                Actually, let's keep it simple: just show total loaded.
            */}
                    <div className="bg-white py-3 rounded-2xl shadow-sm flex flex-col items-center">
                        <span className="text-red-500 font-bold text-lg">
                            {alerts.filter(a => a.status === 'pending' || a.status === 'processing').length}
                        </span>
                        <span className="text-xs text-slate-400">列表待处理</span>
                    </div>
                    <div className="bg-white py-3 rounded-2xl shadow-sm flex flex-col items-center">
                        <span className="text-green-500 font-bold text-lg">
                            {alerts.filter(a => a.status === 'resolved').length}
                        </span>
                        <span className="text-xs text-slate-400">列表已处理</span>
                    </div>
                </div>

                {/* Status Filter Tags */}
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'pending', 'resolved'].map((tag) => {
                        const label = tag === 'all' ? '全部状态' : tag === 'pending' ? '待处理' : '已处理';
                        const isActive = statusFilter === tag;
                        return (
                            <button
                                key={tag}
                                onClick={() => setStatusFilter(tag as any)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                        ${isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-transparent text-slate-400 hover:bg-slate-100'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Category Tags */}
                <div className="flex space-x-3 mb-4 overflow-x-auto pb-1 px-1">
                    {categoryOptions.map((opt) => {
                        const isActive = categoryFilter === opt.key;
                        return (
                            <button
                                key={opt.key}
                                onClick={() => handleCategoryClick(opt.key)}
                                className={`text-xs font-medium px-3 py-1 rounded-full transition-colors whitespace-nowrap
                        ${isActive
                                        ? 'bg-blue-100 text-blue-600 font-bold'
                                        : 'text-slate-400 bg-transparent hover:bg-slate-100'}`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>

                {/* Alert List */}
                <div className="space-y-4">
                    {filteredAlerts.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-400 text-sm">{loading ? '加载中...' : '暂无告警信息'}</p>
                        </div>
                    ) : (
                        filteredAlerts.map((alert, index) => {
                            const isHighlight = index === 0;

                            // Main Highlight Card Style for the first item
                            if (isHighlight) {
                                return (
                                    <div key={alert.id} className="bg-white p-5 rounded-3xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColorForIcon(alert)}`}>
                                                    {getIconForAlert(alert)}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-800">{alert.title}</h3>
                                                    <span className={`text-xs flex items-center mt-0.5 ${alert.status === 'resolved' ? 'text-green-500' : 'text-red-500'}`}>
                                                        ● {alert.status === 'resolved' ? '已处理' : '待处理'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                                            {alert.description}
                                        </p>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <span className="text-xs text-slate-400">{alert.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span className="text-xs text-slate-400">🕒 {alert.time}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-100 pt-3 flex items-center">
                                            <User className="w-3 h-3 text-slate-400 mr-2" />
                                            <span className="text-xs text-slate-400">当前用户处理</span>
                                        </div>
                                    </div>
                                );
                            }

                            // Compact Card Style for other items
                            return (
                                <div key={alert.id} className="bg-white p-5 rounded-3xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColorForIcon(alert)}`}>
                                                {getIconForAlert(alert)}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-800">{alert.title}</h3>
                                                <div className="flex items-center mt-0.5">
                                                    <span className={`text-xs ${alert.status === 'resolved' ? 'text-green-500' : 'text-red-500'} mr-2`}>
                                                        ● {alert.status === 'resolved' ? '已处理' : '待处理'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2">
                                        {alert.description}
                                    </p>
                                    <div className="flex items-center space-x-4 mb-3">
                                        <div className="flex items-center space-x-1">
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs text-slate-400">{alert.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-xs text-slate-400">🕒 {alert.time}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
};