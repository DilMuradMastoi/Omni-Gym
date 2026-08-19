import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { MembershipsPage } from './pages/MembershipsPage';
import { TrainersPage } from './pages/TrainersPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { AttendancePage } from './pages/AttendancePage';
import { PaymentsPage } from './pages/PaymentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AICoachPage } from './pages/AICoachPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { DashboardLayout } from './layouts/DashboardLayout';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage onNavigate={handleNavigate} />;
      case '/login':
        return <LoginPage onNavigate={handleNavigate} />;
      case '/register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case '/dashboard':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <DashboardPage onNavigate={handleNavigate} />
          </DashboardLayout>
        );
      case '/members':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <MembersPage onNavigate={handleNavigate} />
          </DashboardLayout>
        );
      case '/memberships':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <MembershipsPage />
          </DashboardLayout>
        );
      case '/trainers':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <TrainersPage />
          </DashboardLayout>
        );
      case '/workouts':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <WorkoutsPage />
          </DashboardLayout>
        );
      case '/attendance':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <AttendancePage />
          </DashboardLayout>
        );
      case '/payments':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <PaymentsPage />
          </DashboardLayout>
        );
      case '/reports':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <ReportsPage />
          </DashboardLayout>
        );
      case '/ai-coach':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <AICoachPage />
          </DashboardLayout>
        );
      case '/profile':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <ProfilePage />
          </DashboardLayout>
        );
      case '/settings':
        return (
          <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
            <SettingsPage />
          </DashboardLayout>
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return <>{renderPage()}</>;
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
