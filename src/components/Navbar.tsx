import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  Menu,
  User,
  LogOut,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronDown,
  Search,
  Bell,
  Shield
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  title: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, title, onNavigate }) => {
  const { user, logout, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickCheckIn = async () => {
    setIsChecking(true);
    try {
      if (!isCheckedIn) {
        const res = await api.post('/attendance/check-in');
        setIsCheckedIn(true);
        showToast(res.data?.message || 'Successfully checked in!', 'success');
      } else {
        const res = await api.post('/attendance/check-out');
        setIsCheckedIn(false);
        showToast(res.data?.message || 'Successfully checked out!', 'info');
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Check-in status updated.', 'info');
      setIsCheckedIn(!isCheckedIn);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDemoSwitch = async (role: UserRole) => {
    try {
      await demoLogin(role);
      showToast(`Switched to ${role} Portal`, 'success');
      setIsDemoMenuOpen(false);
      onNavigate('/dashboard');
    } catch (err) {
      showToast('Failed to switch role', 'error');
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 lg:px-10 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden transition-colors"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl lg:text-2xl font-serif italic text-white capitalize">{title}</h2>
          <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest mt-0.5">
            {todayDate} • Active Operations
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members, workouts..."
            className="bg-white/5 border border-white/10 rounded-full py-1.5 px-4 text-xs lg:text-sm w-48 lg:w-64 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder-gray-500"
          />
        </div>

        {/* Quick Check-In Button */}
        {user && (
          <button
            onClick={handleQuickCheckIn}
            disabled={isChecking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              isCheckedIn
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {isCheckedIn ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" /> Check-In
              </>
            )}
          </button>
        )}

        {/* Demo Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-amber-500 transition-all"
            title="Switch demo role"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{user?.role || 'Guest'}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {isDemoMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 mb-1">
                Quick Portal Access
              </div>
              <button
                onClick={() => handleDemoSwitch('Admin')}
                className="w-full text-left px-3 py-2 text-gray-200 hover:bg-white/5 hover:text-amber-500 font-medium flex items-center justify-between"
              >
                <span>👑 Admin</span>
                {user?.role === 'Admin' && <span className="text-amber-500 font-bold">Active</span>}
              </button>
              <button
                onClick={() => handleDemoSwitch('Trainer')}
                className="w-full text-left px-3 py-2 text-gray-200 hover:bg-white/5 hover:text-amber-500 font-medium flex items-center justify-between"
              >
                <span>🏋️ Trainer</span>
                {user?.role === 'Trainer' && <span className="text-amber-500 font-bold">Active</span>}
              </button>
              <button
                onClick={() => handleDemoSwitch('Member')}
                className="w-full text-left px-3 py-2 text-gray-200 hover:bg-white/5 hover:text-amber-500 font-medium flex items-center justify-between"
              >
                <span>👤 Member</span>
                {user?.role === 'Member' && <span className="text-amber-500 font-bold">Active</span>}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <button
          className="p-2 rounded-full bg-white/5 border border-white/10 relative text-gray-400 hover:text-white transition-colors"
          title="Notifications"
        >
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all border border-white/10"
            >
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.fullName}
                className="w-7 h-7 rounded-full object-cover bg-gray-800"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="font-serif italic text-white text-sm truncate">{user.fullName}</p>
                  <p className="text-gray-500 text-[11px] truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('/profile');
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 font-medium"
                >
                  <User className="w-4 h-4 text-gray-400" /> View Profile
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 font-medium"
                >
                  <Shield className="w-4 h-4 text-gray-400" /> Account Settings
                </button>
                <div className="border-t border-white/10 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

