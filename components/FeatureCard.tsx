import React from 'react';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  bgColor?: string; // For the faint background
  onClick?: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, subtitle, icon, iconBg, bgColor = "bg-white", onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${bgColor} rounded-3xl p-5 shadow-sm relative flex flex-col justify-between h-36 active:scale-95 transition-transform duration-100 cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${iconBg} shadow-md`}>
          {icon}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300" />
      </div>
      <div>
        <h3 className="text-slate-800 font-bold text-lg">{title}</h3>
        <p className="text-slate-400 text-xs mt-1">{subtitle}</p>
      </div>
    </div>
  );
};