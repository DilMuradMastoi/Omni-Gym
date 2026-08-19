import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserCheck,
  Dumbbell,
  CalendarCheck,
  FileSpreadsheet,
  BarChart3,
  Bot,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, isOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Trainer', 'Member'] },
    { label: 'Members', path: '/members', icon: Users, roles: ['Admin', 'Trainer'] },
    { label: 'Memberships', path: '/memberships', icon: CreditCard, roles: ['Admin', 'Trainer', 'Member'] },
    { label: 'Trainers', path: '/trainers', icon: UserCheck, roles: ['Admin', 'Trainer', 'Member'] },
    { label: 'Workout Plans', path: '/workouts', icon: Dumbbell, roles: ['Admin', 'Trainer', 'Member'] },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['Admin', 'Trainer', 'Member'] },
    { label: 'Payments', path: '/payments', icon: FileSpreadsheet, roles: ['Admin', 'Member'] },
    { label: 'Reports & Analytics', path: '/reports', icon: BarChart3, roles: ['Admin', 'Trainer'] },
    { label: 'AI Fitness Coach', path: '/ai-coach', icon: Bot, roles: ['Admin', 'Trainer', 'Member'], badge: 'AI' },
    { label: 'My Profile', path: '/profile', icon: User, roles: ['Admin', 'Trainer', 'Member'] },
    { label: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Trainer', 'Member'] },
  ];

  const filteredItems = navItems.filter(item => !user || item.roles.includes(user.role));

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Gym Logo & Header */}
          <div className="p-6 border-b border-white/10 shrink-0">
            <button
              onClick={() => handleLinkClick('/dashboard')}
              className="flex items-center gap-3 group text-left focus:outline-none w-full"
            >
              <div className="h-9 w-9 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xl italic shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                Ω
              </div>
              <div>
                <h1 className="text-xl font-serif italic tracking-tight text-white leading-tight">
                  OmniGym
                </h1>
                <span className="text-[10px] font-sans not-italic font-bold uppercase tracking-widest text-amber-500 opacity-80 block">
                  FitZone PRO
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-white/5 border border-white/10 text-amber-500 shadow-sm'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500 text-black uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* User Account Footer */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-0.5 truncate">
                  {user?.role || 'Guest'} Account
                </p>
                <p className="text-sm text-white font-serif italic truncate">
                  {user?.fullName || 'Jonathan Vickers'}
                </p>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

