import React, { useState } from 'react';
import {
  Dumbbell,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Calculator,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { demoLogin } = useAuth();
  const [height, setHeight] = useState<string>('178');
  const [weight, setWeight] = useState<string>('75');
  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(23.7);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const score = Number((w / (h * h)).toFixed(1));
      setCalculatedBmi(score);
    }
  };

  const handleDemoAccess = async (role: UserRole) => {
    await demoLogin(role);
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans antialiased overflow-x-hidden">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xl italic shrink-0 shadow-lg shadow-amber-500/20">
              Ω
            </div>
            <h1 className="text-xl font-serif italic tracking-tight text-white">
              OmniGym <span className="text-xs font-sans not-italic font-bold uppercase tracking-widest text-amber-500 opacity-80 inline-block ml-1">FitZone PRO</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <a href="#features" className="hover:text-amber-500 transition-colors">Features</a>
            <a href="#portals" className="hover:text-amber-500 transition-colors">Portals</a>
            <a href="#bmi-calculator" className="hover:text-amber-500 transition-colors">BMI Calculator</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:text-amber-500 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => handleDemoAccess('Admin')}
              className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-black bg-amber-500 hover:bg-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              Launch Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-500 text-xs font-bold uppercase tracking-widest mb-8">
          <Sparkles className="w-3.5 h-3.5" /> Premium Operations Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif italic text-white tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Power Your Fitness Business with <span className="text-amber-500">Precision & Elegance</span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Complete role-based SaaS ecosystem to manage members, trainers, attendance check-ins, custom workout plans, monthly revenues, and AI fitness insights.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => handleDemoAccess('Admin')}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3"
          >
            Launch Admin Portal <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDemoAccess('Member')}
            className="w-full sm:w-auto px-8 py-4 bg-[#0f0f0f] hover:bg-white/5 text-white font-bold uppercase tracking-widest text-xs rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3"
          >
            Explore Member View
          </button>
        </div>

        {/* Feature Pill Grid */}
        <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/10">
            <ShieldCheck className="w-6 h-6 text-amber-500 mb-3" />
            <h3 className="font-serif italic text-white text-lg">JWT Role Security</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">Admin, Trainer, and Member RBAC controls and session management.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/10">
            <Clock className="w-6 h-6 text-amber-500 mb-3" />
            <h3 className="font-serif italic text-white text-lg">Attendance Logs</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">Instant check-in & check-out time tracking with live statistics.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/10">
            <Dumbbell className="w-6 h-6 text-amber-500 mb-3" />
            <h3 className="font-serif italic text-white text-lg">Workout Builder</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">Custom exercise plans with sets, reps, and muscle target guidance.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/10">
            <TrendingUp className="w-6 h-6 text-amber-500 mb-3" />
            <h3 className="font-serif italic text-white text-lg">Revenue Analytics</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">Payment logs, cash/card breakdowns, and growth reports.</p>
          </div>
        </div>
      </section>

      {/* Demo Quick Access Section */}
      <section id="portals" className="py-20 px-6 bg-[#0a0a0a] border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif italic text-white">Experience Live Portals</h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">Test the platform instantly with pre-loaded demo accounts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                  Admin Role
                </span>
                <h3 className="text-xl font-serif italic text-white mt-4">Gym Administrator</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Full control over members, trainers, membership plan creation, financial transactions, and system analytics.
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-gray-400 font-mono">
                  admin@fitzone.com | admin123
                </div>
              </div>
              <button
                onClick={() => handleDemoAccess('Admin')}
                className="mt-8 w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl transition-all"
              >
                Log In as Admin
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10 uppercase tracking-widest">
                  Trainer Role
                </span>
                <h3 className="text-xl font-serif italic text-white mt-4">Fitness Trainer</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Manage assigned gym members, design custom workout routines, and monitor attendance progress.
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-gray-400 font-mono">
                  trainer.alex@fitzone.com | trainer123
                </div>
              </div>
              <button
                onClick={() => handleDemoAccess('Trainer')}
                className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-xl border border-white/10 transition-all"
              >
                Log In as Trainer
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                  Member Role
                </span>
                <h3 className="text-xl font-serif italic text-white mt-4">Gym Member</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  View active membership details, daily exercise plans, personal attendance logs, and AI coaching.
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-gray-400 font-mono">
                  member.david@fitzone.com | member123
                </div>
              </div>
              <button
                onClick={() => handleDemoAccess('Member')}
                className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-xl border border-white/10 transition-all"
              >
                Log In as Member
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive BMI Calculator */}
      <section id="bmi-calculator" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-serif italic text-white">Interactive BMI Calculator</h2>
              <p className="text-xs text-gray-400 mt-0.5">Evaluate Body Mass Index metrics and training focus for members.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
              <button
                onClick={calculateBMI}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl transition-colors shadow-md shadow-amber-500/10"
              >
                Calculate BMI Metric
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-black border border-white/10 text-center flex flex-col justify-center h-full">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Calculated Score</span>
              <span className="text-5xl font-serif italic text-amber-500 my-3">{calculatedBmi ?? '--'}</span>
              <p className="text-xs font-medium text-gray-300">
                {calculatedBmi && calculatedBmi < 18.5 && 'Underweight • Focus on Strength & Caloric Surplus'}
                {calculatedBmi && calculatedBmi >= 18.5 && calculatedBmi < 25 && 'Healthy Weight • Optimal Maintenance Strategy'}
                {calculatedBmi && calculatedBmi >= 25 && calculatedBmi < 30 && 'Overweight • Fat Loss & Cardiovascular Focus'}
                {calculatedBmi && calculatedBmi >= 30 && 'Obese • Structured Metabolic HIIT & Conditioning'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-xs text-gray-500 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif italic text-white text-sm">OmniGym FitZone PRO SaaS</span>
          <p>© 2026 FitZone Systems Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

