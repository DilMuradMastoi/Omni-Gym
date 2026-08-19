import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Settings, Shield, Bell, Moon, Lock, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif italic text-white">System Settings</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Configure facility notifications, security protocols, and system defaults</p>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="font-serif italic text-lg text-white">Security & Access</h3>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <p className="text-sm font-medium text-white">Two-Factor Security Authentication</p>
              <p className="text-xs text-gray-500 mt-0.5">Require TOTP code when logging in from unknown devices</p>
            </div>
            <button
              onClick={() => {
                setTwoFactor(!twoFactor);
                showToast('Two-factor setting updated', 'info');
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${twoFactor ? 'bg-amber-500' : 'bg-gray-800'}`}
            >
              <div className={`w-4 h-4 bg-black rounded-full absolute top-1 transition-transform ${twoFactor ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <p className="text-sm font-medium text-white">Email & Push Notifications</p>
              <p className="text-xs text-gray-500 mt-0.5">Receive check-in alerts and pending payment reminders</p>
            </div>
            <button
              onClick={() => {
                setNotifications(!notifications);
                showToast('Notification preference updated', 'info');
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-amber-500' : 'bg-gray-800'}`}
            >
              <div className={`w-4 h-4 bg-black rounded-full absolute top-1 transition-transform ${notifications ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
