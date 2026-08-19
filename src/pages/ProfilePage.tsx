import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Phone, Award, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif italic text-white">My Profile</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Personal details, access credentials, and active membership tier</p>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-serif italic text-3xl font-bold shadow-xl shadow-amber-500/20">
            {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'JV'}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-serif italic text-white">{user?.fullName || 'Jonathan Vickers'}</h2>
            <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mt-1">
              {user?.role || 'Admin'} Role • FitZone PRO Member
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
            <span className="text-gray-500 font-bold uppercase tracking-wider block">Email Address</span>
            <span className="text-white font-medium">{user?.email || 'admin@fitzone.com'}</span>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
            <span className="text-gray-500 font-bold uppercase tracking-wider block">Username</span>
            <span className="text-white font-medium">@{user?.username || 'admin'}</span>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
            <span className="text-gray-500 font-bold uppercase tracking-wider block">Membership Tier</span>
            <span className="text-amber-500 font-bold">{user?.membershipName || 'VIP All-Access'}</span>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
            <span className="text-gray-500 font-bold uppercase tracking-wider block">Joined Date</span>
            <span className="text-white font-medium">{user?.joinDate || '2024-01-15'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
