import React, { useState } from 'react';
import { ViewState, Alert } from './types';
import { LoginView } from './views/LoginView';
import { HomeView } from './views/HomeView';
import { MonitorView } from './views/MonitorView';
import { AlertsView } from './views/AlertsView';
import { IntersectionDetailView } from './views/IntersectionDetailView';
import { StatsView } from './views/StatsView';
import { DeviceManagementView } from './views/DeviceManagementView';
import { SystemSettingsView } from './views/SystemSettingsView';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOGIN);
  const [selectedIntersectionId, setSelectedIntersectionId] = useState<string | null>(null);
  const [alertParams, setAlertParams] = useState<{ status?: 'all' | 'pending' | 'resolved', category?: Alert['type'] | 'all' }>({});

  const renderView = () => {
    switch (currentView) {
      case ViewState.LOGIN:
        return <LoginView onLogin={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.HOME:
        return <HomeView
          onChangeView={setCurrentView}
          onNavigateToAlerts={(status, category) => {
            setAlertParams({ status, category });
            setCurrentView(ViewState.ALERTS);
          }}
        />;
      case ViewState.MONITOR:
        return <MonitorView
          onBack={() => setCurrentView(ViewState.HOME)}
          onDetail={(id) => {
            setSelectedIntersectionId(id);
            setCurrentView(ViewState.INTERSECTION_DETAIL);
          }}
        />;
      case ViewState.ALERTS:
        return <AlertsView
          onBack={() => {
            setCurrentView(ViewState.HOME);
            setAlertParams({});
          }}
          initialStatusFilter={alertParams.status}
          initialCategoryFilter={alertParams.category}
        />;
      case ViewState.INTERSECTION_DETAIL:
        return <IntersectionDetailView
          onBack={() => setCurrentView(ViewState.MONITOR)}
          intersectionId={selectedIntersectionId}
        />;
      case ViewState.STATS:
        return <StatsView onBack={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.DEVICE_MANAGEMENT:
        return <DeviceManagementView onBack={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.SYSTEM_SETTINGS:
        return <SystemSettingsView onBack={() => setCurrentView(ViewState.HOME)} onLogout={() => setCurrentView(ViewState.LOGIN)} />;
      default:
        return <LoginView onLogin={() => setCurrentView(ViewState.HOME)} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl relative">
      {renderView()}

      {/* Show Bottom Nav only when logged in */}
      {currentView !== ViewState.LOGIN && (
        <BottomNav currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;