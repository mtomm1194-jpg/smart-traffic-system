import React from 'react';
import { ViewState } from '../types';
import { Eye, Lock, User } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Circles matching screenshot */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60"></div>
      <div className="absolute top-40 right-[-20px] w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60"></div>

      {/* Logo Area */}
      <div className="flex flex-col items-center mb-10 z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
          {/* Simple abstract logo shape */}
          <div className="flex flex-col space-y-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-3 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">智畅通</h1>
        <p className="text-slate-400 text-sm mt-1">智能交通管理系统</p>
        <div className="flex space-x-1 mt-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-xl shadow-slate-200/50 z-10">
        <h2 className="text-xl font-bold text-center text-slate-800 mb-8">用户登录</h2>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">用户名</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-sm"
                placeholder="请输入用户名"
                defaultValue="admin"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">密码</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-11 pr-11 py-3.5 bg-white border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all shadow-sm"
                placeholder="请输入密码"
                defaultValue="password"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                <Eye className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            onClick={onLogin}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95"
          >
            登录
          </button>

          <div className="text-center">
            <a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-600">
              忘记密码?
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center z-10">
        <p className="text-[10px] text-slate-400">© 2024 智畅通科技有限公司</p>
        <p className="text-[10px] text-slate-300 mt-1">版本 v1.0.0</p>
      </div>
    </div>
  );
};