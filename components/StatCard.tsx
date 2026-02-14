import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  statusText?: string;
  statusColor?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit, statusText, statusColor, icon }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="mt-2">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          {unit && <span className="text-sm text-slate-500">{unit}</span>}
        </div>
        {statusText && (
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${statusColor === 'green' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span className={`text-xs font-medium ${statusColor === 'green' ? 'text-green-500' : 'text-orange-500'}`}>
              {statusText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};