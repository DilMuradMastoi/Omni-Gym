import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  Sparkles
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, demoLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      onNavigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Invalid credentials. Please try again.');
      showToast('Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = async (role: UserRole) => {
    setIsLoading(true);
    try {
      await demoLogin(role);
      showToast(`Logged in as ${role}!`, 'success');
      onNavigate('/dashboard');
    } catch (err) {
      showToast('Demo login failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans text-gray-200">
      {/* Background glow graphic */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Header */}
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
          <h2 className="text-2xl font-serif italic text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Sign in to your Gym Operations Account</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fitzone.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 bg-black text-amber-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
            <span className="text-amber-500 hover:underline cursor-pointer">Forgot password?</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Demo Fast Logins Divider */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Fast Portals
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoClick('Admin')}
              disabled={isLoading}
              className="py-2 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold text-amber-500 transition-all uppercase tracking-wider"
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleDemoClick('Trainer')}
              disabled={isLoading}
              className="py-2 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold text-gray-300 transition-all uppercase tracking-wider"
            >
              🏋️ Trainer
            </button>
            <button
              onClick={() => handleDemoClick('Member')}
              disabled={isLoading}
              className="py-2 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-bold text-emerald-400 transition-all uppercase tracking-wider"
            >
              👤 Member
            </button>
          </div>
        </div>

        {/* Footer link to register */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-amber-500 font-bold hover:underline ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

