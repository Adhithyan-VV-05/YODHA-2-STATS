import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext';
import { CommandCenterProvider } from './context/CommandCenterContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/layout/CommandPalette';
import { AdminLoginModal } from './components/common/AdminLoginModal';
import { AdminLockGate } from './components/common/AdminLockGate';

import { DashboardPage } from './pages/DashboardPage';
import { TeamsPage } from './pages/TeamsPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { VisitorsPage } from './pages/VisitorsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { ExportsPage } from './pages/ExportsPage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient();

function AppContent() {
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAdminAuthenticated) {
    return <AdminLockGate />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
        {/* Top Bar Header */}
        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          {/* Collapsible Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 relative">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/participants" element={<ParticipantsPage />} />
              <Route path="/visitors" element={<VisitorsPage />} />
              <Route path="/referrals" element={<ReferralsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/exports" element={<ExportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Modals */}
        <CommandPalette />
        <AdminLoginModal />
      </div>
    </Router>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AdminAuthProvider>
          <CommandCenterProvider>
            <AppContent />
          </CommandCenterProvider>
        </AdminAuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
