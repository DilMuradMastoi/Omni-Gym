import React, { useState, useEffect } from 'react';
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
  const { isAuthenticated, isLoading } = useAuth();

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync navigation with authentication status
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/', '/login', '/register'];
    const isPublicPath = publicPaths.includes(currentPath);

    if (isAuthenticated && isPublicPath) {
      setCurrentPath('/dashboard');
    } else if (!isAuthenticated && !isPublicPath) {
      setCurrentPath('/login');
    }
  }, [isAuthenticated, isLoading, currentPath]);

  // Loading spinner while checking local auth session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Wrapper for authenticated pages inside the Dashboard Layout
 const renderProtected = (title: string, children: React.ReactNode) => (
  <DashboardLayout title={title} currentPath={currentPath} onNavigate={handleNavigate}>
    {children}
  </DashboardLayout>
);

  const renderPage = () => {
  switch (currentPath) {
    case '/':
      return <LandingPage onNavigate={handleNavigate} />;
    case '/login':
      return <LoginPage onNavigate={handleNavigate} />;
    case '/register':
      return <RegisterPage onNavigate={handleNavigate} />;
    case '/dashboard':
      return renderProtected('Dashboard', <DashboardPage onNavigate={handleNavigate} />);
    case '/members':
      return renderProtected('Members', <MembersPage onNavigate={handleNavigate} />);
    case '/memberships':
      return renderProtected('Memberships', <MembershipsPage />);
    case '/trainers':
      return renderProtected('Trainers', <TrainersPage />);
    case '/workouts':
      return renderProtected('Workouts', <WorkoutsPage />);
    case '/attendance':
      return renderProtected('Attendance', <AttendancePage />);
    case '/payments':
      return renderProtected('Payments', <PaymentsPage />);
    case '/reports':
      return renderProtected('Reports', <ReportsPage />);
    case '/ai-coach':
      return renderProtected('AI Coach', <AICoachPage />);
    case '/profile':
      return renderProtected('Profile', <ProfilePage />);
    case '/settings':
      return renderProtected('Settings', <SettingsPage />);
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