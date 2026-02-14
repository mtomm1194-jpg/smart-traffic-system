import React, { useState } from 'react';
import { ArrowLeft, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, User, Lock, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MOCK_INTERSECTION, MOCK_ALERTS } from '../constants';

interface SystemSettingsViewProps {
    onBack: () => void;
    onLogout: () => void;
}

// ... existing imports

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({ onBack, onLogout }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [showSeedConfirm, setShowSeedConfirm] = useState(false);


    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        onLogout();
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleSeedDataClick = () => {
        setShowSeedConfirm(true);
    };

    const confirmSeedData = async () => {
        setShowSeedConfirm(false);

        try {
            setSeeding(true);

            // Seed Intersections
            const intersectionsToInsert = [
                {
                    name: '中山路与人民路交叉口',
                    status: 'online',
                    traffic_flow: 1245,
                    avg_speed: 35,
                    congestion_level: 'moderate',
                    signal_phase: 'NS_GREEN',
                    count_down: 15
                },
                {
                    name: '建设大道与香港路交叉口',
                    status: 'online',
                    traffic_flow: 850,
                    avg_speed: 42,
                    congestion_level: 'low',
                    signal_phase: 'EW_RED',
                    count_down: 45
                },
                {
                    name: '解放大道与循礼门交叉口',
                    status: 'warning',
                    traffic_flow: 2100,
                    avg_speed: 15,
                    congestion_level: 'heavy',
                    signal_phase: 'NS_RED',
                    count_down: 30
                },
                {
                    name: '和平大道与新生路交叉口',
                    status: 'offline',
                    traffic_flow: 0,
                    avg_speed: 0,
                    congestion_level: 'low',
                    signal_phase: 'ALL_RED',
                    count_down: 0
                }
            ];

            const { error: intersectionError } = await supabase
                .from('intersections')
                .insert(intersectionsToInsert);

            if (intersectionError) throw intersectionError;

            // Seed Alerts
            const alertsToInsert = MOCK_ALERTS.map(alert => ({
                type: alert.type,
                title: alert.title,
                description: alert.description,
                time: new Date().toISOString(), // Use current time
                location: alert.location,
                status: alert.status
            }));

            const { error: alertError } = await supabase
                .from('alerts')
                .insert(alertsToInsert);

            if (alertError) throw alertError;

            alert('测试数据写入成功！请刷新页面查看。');
        } catch (error: any) {
            console.error('Error seeding data:', error);
            alert('写入数据失败: ' + error.message + ' (请确保已在 Supabase 执行 enable_insert_policy.sql)');
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="pb-24 pt-4 bg-slate-50 min-h-screen relative">
            {/* Header */}
            <div className="px-5 mb-6 flex items-center space-x-3">
                <button onClick={onBack} className="p-1 -ml-1 active:bg-slate-200 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-800" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">系统设置</h1>
            </div>

            <div className="px-5 space-y-6">
                {/* Debug/Test Section */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase mb-3 ml-1">开发调试</h2>
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden px-5">
                        <button
                            onClick={handleSeedDataClick}
                            disabled={seeding}
                            className="w-full py-4 flex items-center justify-between active:opacity-70 transition-opacity disabled:opacity-50"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center text-[10px] font-bold text-blue-500">
                                    D
                                </div>
                                <span className="text-sm font-medium text-slate-700">写入测试数据</span>
                            </div>
                            {seeding ? <span className="text-xs text-slate-400">写入中...</span> : <ChevronRight className="w-4 h-4 text-slate-300" />}
                        </button>
                    </div>
                </div>
                {/* ... existing sections ... */}



                {/* Account Section */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase mb-3 ml-1">账号</h2>
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                        {/* ... rest of existing code ... */}
                        <div className="p-5 flex items-start justify-between relative">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                                    A
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">Admin User</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">admin@traffic-sys.com</p>
                                </div>
                            </div>
                            <button className="text-xs text-slate-500 font-medium px-2 py-1 hover:bg-slate-50 rounded transition-colors flex items-center">
                                编辑
                            </button>
                        </div>

                        <div className="px-5 pb-2">
                            <button className="w-full py-4 flex items-center justify-between border-t border-slate-50 active:opacity-70 transition-opacity">
                                <div className="flex items-center space-x-3">
                                    <User className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">个人信息</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </button>

                            <button className="w-full py-4 flex items-center justify-between border-t border-slate-50 active:opacity-70 transition-opacity">
                                <div className="flex items-center space-x-3">
                                    <Lock className="w-5 h-5 text-green-500" />
                                    <span className="text-sm font-medium text-slate-700">账号安全</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase mb-3 ml-1">通用</h2>
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden px-5">
                        <div className="w-full py-4 flex items-center justify-between border-b border-slate-50">
                            <div className="flex items-center space-x-3">
                                <Bell className="w-5 h-5 text-orange-500" />
                                <span className="text-sm font-medium text-slate-700">通知推送</span>
                            </div>
                            <div
                                className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors duration-300 ${notificationsEnabled ? 'bg-blue-500' : 'bg-slate-200'}`}
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            >
                                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${notificationsEnabled ? 'left-[22px]' : 'left-0.5'}`}></div>
                            </div>
                        </div>

                        <div className="w-full py-4 flex items-center justify-between border-b border-slate-50">
                            <div className="flex items-center space-x-3">
                                <Moon className="w-5 h-5 text-purple-500" />
                                <span className="text-sm font-medium text-slate-700">深色模式</span>
                            </div>
                            <div
                                className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors duration-300 ${darkModeEnabled ? 'bg-blue-500' : 'bg-slate-200'}`}
                                onClick={() => setDarkModeEnabled(!darkModeEnabled)}
                            >
                                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${darkModeEnabled ? 'left-[22px]' : 'left-0.5'}`}></div>
                            </div>
                        </div>

                        <button className="w-full py-4 flex items-center justify-between active:opacity-70 transition-opacity">
                            <div className="flex items-center space-x-3">
                                <Globe className="w-5 h-5 text-indigo-500" />
                                <span className="text-sm font-medium text-slate-700">语言设置</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-slate-400">简体中文</span>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Support */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase mb-3 ml-1">其他</h2>
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden px-5">
                        <button className="w-full py-4 flex items-center justify-between border-b border-slate-50 active:opacity-70 transition-opacity">
                            <div className="flex items-center space-x-3">
                                <HelpCircle className="w-5 h-5 text-teal-500" />
                                <span className="text-sm font-medium text-slate-700">帮助与反馈</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </button>

                        <button className="w-full py-4 flex items-center justify-between active:opacity-70 transition-opacity">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-5 h-5 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">关于我们</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleLogoutClick}
                    className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center space-x-2 active:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>退出登录</span>
                </button>

                <p className="text-center text-[10px] text-slate-300 pb-4">Version 1.0.0</p>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-800 text-center mb-2">确认退出</h3>
                        <p className="text-sm text-slate-500 text-center mb-6">您确定要退出当前账号吗？</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl active:bg-slate-200 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 active:bg-red-600 transition-colors"
                            >
                                退出
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Seed Data Confirmation Modal */}
            {showSeedConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-800 text-center mb-2">写入测试数据</h3>
                        <p className="text-sm text-slate-500 text-center mb-6">确定要向数据库写入演示数据嗎？这可能需要几秒钟。</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowSeedConfirm(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl active:bg-slate-200 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={confirmSeedData}
                                className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:bg-blue-600 transition-colors"
                            >
                                确定写入
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};