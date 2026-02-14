import React from 'react';
import { Home, Map, Bell } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const getIconColor = (view: ViewState) => {
    // If the current view matches, or if we are in a sub-view of that category
    if (view === ViewState.HOME && currentView === ViewState.HOME) return 'text-blue-600';
    if (view === ViewState.MONITOR && (currentView === ViewState.MONITOR || currentView === ViewState.INTERSECTION_DETAIL)) return 'text-blue-600';
    if (view === ViewState.ALERTS && currentView === ViewState.ALERTS) return 'text-blue-600';
    return 'text-slate-400';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
      <button 
        onClick={() => onChangeView(ViewState.HOME)}
        className="flex flex-col items-center space-y-1 w-1/3"
      >
        <Home className={`w-6 h-6 ${getIconColor(ViewState.HOME)}`} />
        <span className={`text-xs ${getIconColor(ViewState.HOME)}`}>首页</span>
      </button>

      <button 
        onClick={() => onChangeView(ViewState.MONITOR)}
        className="flex flex-col items-center space-y-1 w-1/3"
      >
        <Map className={`w-6 h-6 ${getIconColor(ViewState.MONITOR)}`} />
        <span className={`text-xs ${getIconColor(ViewState.MONITOR)}`}>监控</span>
      </button>

      <button 
        onClick={() => onChangeView(ViewState.ALERTS)}
        className="flex flex-col items-center space-y-1 w-1/3"
      >
        <Bell className={`w-6 h-6 ${getIconColor(ViewState.ALERTS)}`} />
        <span className={`text-xs ${getIconColor(ViewState.ALERTS)}`}>告警</span>
      </button>
    </div>
  );
};