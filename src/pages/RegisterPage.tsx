import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Loader2,
  Sparkles
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Member');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        role,
        username: email.split('@')[0]
      });
      showToast('Account created successfully! Welcome to FitZone PRO.', 'success');
      onNavigate('/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans text-gray-200">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-3 group mb-4 focus:outline-none"
          >
            <div className="h-9 w-9 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xl italic shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              Ω
            </div>
            <div className="text-left">
              <h1 className="text-xl font-serif italic tracking-tight text-white leading-tight">
                OmniGym
              </h1>
              <span className="text-[10px] font-sans not-italic font-bold uppercase tracking-widest text-amber-500 opacity-80 block">
                FitZone PRO
              </span>
            </div>
          </button>
          <h2 className="text-2xl font-serif italic text-white tracking-tight">Create an Account</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Join OmniGym FitZone Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jonathan Vickers"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vickers@fitzone.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
            >
              <option value="Member">Member</option>
              <option value="Trainer">Trainer</option>
              <option value="Admin">Gym Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-amber-500 font-bold hover:underline ml-1"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
