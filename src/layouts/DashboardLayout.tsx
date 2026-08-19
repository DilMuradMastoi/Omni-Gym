import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  title
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex flex-col font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          title={title}
          onNavigate={onNavigate}
        />

        <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <footer className="border-t border-white/10 py-4 px-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#0a0a0a]/50">
          <p>© 2026 OmniGym FitZone PRO Gym Operations Management System.</p>
          <div className="flex items-center gap-4 text-gray-500 font-medium text-xs">
            <span className="hover:text-amber-500 cursor-pointer">Security Protocol</span>
            <span className="hover:text-amber-500 cursor-pointer">API v2.4</span>
            <span className="hover:text-amber-500 cursor-pointer">Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

