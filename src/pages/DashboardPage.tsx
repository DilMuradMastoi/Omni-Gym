import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import {
  Users,
  TrendingUp,
  UserCheck,
  CalendarCheck,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Dumbbell,
  Clock,
  Plus,
  ChevronRight,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('month');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const defaultStats: DashboardStats = {
    totalMembers: 1248,
    activeMembers: 1102,
    trainersCount: 24,
    monthlyRevenue: 42190,
    paymentsReceivedCount: 142,
    pendingPaymentsAmount: 1850,
    attendanceTodayCount: 312,
    workoutPlansCount: 68,
    newRegistrationsCount: 38,
    recentPayments: [
      { id: '1', memberId: 'm1', memberName: 'Aria Stirling', membershipId: 'p1', membershipName: 'VIP Membership', amount: 249, paymentMethod: 'Card', paymentDate: '2026-07-29', status: 'Completed', transactionId: 'TX-90812' },
      { id: '2', memberId: 'm2', memberName: 'Marcus Thorne', membershipId: 'p2', membershipName: 'Standard Plan', amount: 129, paymentMethod: 'Cash', paymentDate: '2026-07-29', status: 'Completed', transactionId: 'TX-90813' },
      { id: '3', memberId: 'm3', memberName: 'Elena Belova', membershipId: 'p3', membershipName: 'Premium Pass', amount: 189, paymentMethod: 'Card', paymentDate: '2026-07-28', status: 'Completed', transactionId: 'TX-90814' }
    ],
    revenueChart: [
      { month: 'Jan', revenue: 28400, target: 30000 },
      { month: 'Feb', revenue: 32100, target: 32000 },
      { month: 'Mar', revenue: 31800, target: 33000 },
      { month: 'Apr', revenue: 36500, target: 35000 },
      { month: 'May', revenue: 39200, target: 38000 },
      { month: 'Jun', revenue: 42190, target: 40000 },
      { month: 'Jul', revenue: 44000, target: 42000 }
    ],
    attendanceChart: [
      { day: 'Mon', count: 280 },
      { day: 'Tue', count: 310 },
      { day: 'Wed', count: 295 },
      { day: 'Thu', count: 340 },
      { day: 'Fri', count: 325 },
      { day: 'Sat', count: 210 },
      { day: 'Sun', count: 180 }
    ],
    membershipDistribution: [
      { name: 'VIP', value: 240 },
      { name: 'Premium', value: 480 },
      { name: 'Standard', value: 380 },
      { name: 'Basic', value: 148 }
    ]
  };

  const data: DashboardStats = {
    totalMembers: typeof stats?.totalMembers === 'number' ? stats.totalMembers : (typeof (stats as any)?.adminData?.totalMembers === 'number' ? (stats as any).adminData.totalMembers : defaultStats.totalMembers),
    activeMembers: typeof stats?.activeMembers === 'number' ? stats.activeMembers : (typeof (stats as any)?.adminData?.activeMembers === 'number' ? (stats as any).adminData.activeMembers : defaultStats.activeMembers),
    trainersCount: typeof stats?.trainersCount === 'number' ? stats.trainersCount : (typeof (stats as any)?.adminData?.trainersCount === 'number' ? (stats as any).adminData.trainersCount : defaultStats.trainersCount),
    monthlyRevenue: typeof stats?.monthlyRevenue === 'number' ? stats.monthlyRevenue : (typeof (stats as any)?.adminData?.monthlyRevenue === 'number' ? (stats as any).adminData.monthlyRevenue : defaultStats.monthlyRevenue),
    paymentsReceivedCount: typeof stats?.paymentsReceivedCount === 'number' ? stats.paymentsReceivedCount : (typeof (stats as any)?.adminData?.paymentsReceivedCount === 'number' ? (stats as any).adminData.paymentsReceivedCount : defaultStats.paymentsReceivedCount),
    pendingPaymentsAmount: typeof stats?.pendingPaymentsAmount === 'number' ? stats.pendingPaymentsAmount : (typeof (stats as any)?.adminData?.pendingPaymentsAmount === 'number' ? (stats as any).adminData.pendingPaymentsAmount : defaultStats.pendingPaymentsAmount),
    attendanceTodayCount: typeof stats?.attendanceTodayCount === 'number' ? stats.attendanceTodayCount : (typeof (stats as any)?.adminData?.attendanceTodayCount === 'number' ? (stats as any).adminData.attendanceTodayCount : defaultStats.attendanceTodayCount),
    workoutPlansCount: typeof stats?.workoutPlansCount === 'number' ? stats.workoutPlansCount : (typeof (stats as any)?.adminData?.workoutPlansCount === 'number' ? (stats as any).adminData.workoutPlansCount : defaultStats.workoutPlansCount),
    newRegistrationsCount: typeof stats?.newRegistrationsCount === 'number' ? stats.newRegistrationsCount : (typeof (stats as any)?.adminData?.newRegistrationsCount === 'number' ? (stats as any).adminData.newRegistrationsCount : defaultStats.newRegistrationsCount),
    recentPayments: Array.isArray(stats?.recentPayments) ? stats.recentPayments : (Array.isArray((stats as any)?.adminData?.recentPayments) ? (stats as any).adminData.recentPayments : defaultStats.recentPayments),
    revenueChart: Array.isArray(stats?.revenueChart) ? stats.revenueChart : (Array.isArray((stats as any)?.adminData?.revenueChart) ? (stats as any).adminData.revenueChart : defaultStats.revenueChart),
    attendanceChart: Array.isArray(stats?.attendanceChart) ? stats.attendanceChart : (Array.isArray((stats as any)?.adminData?.attendanceChart) ? (stats as any).adminData.attendanceChart : defaultStats.attendanceChart),
    membershipDistribution: Array.isArray(stats?.membershipDistribution) ? stats.membershipDistribution : (Array.isArray((stats as any)?.adminData?.membershipDistribution) ? (stats as any).adminData.membershipDistribution : defaultStats.membershipDistribution)
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Welcome */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Sophisticated Operations Console
          </div>
          <h1 className="text-3xl font-serif italic text-white">
            Welcome back, {user?.fullName || 'Jonathan Vickers'}
          </h1>
          <p className="text-xs text-gray-400 max-w-xl">
            Here is your live daily performance breakdown for {user?.role || 'Admin'} operations across FitZone PRO facilities.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('/members')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
          <button
            onClick={() => onNavigate('/workouts')}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
          >
            <Dumbbell className="w-4 h-4 text-amber-500" /> New Routine
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Members</p>
          <p className="text-4xl font-serif italic text-white mt-1">{data.totalMembers.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Monthly Revenue</p>
          <p className="text-4xl font-serif italic text-white mt-1">${data.monthlyRevenue.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.4% vs last period</span>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Active Trainers</p>
          <p className="text-4xl font-serif italic text-white mt-1">{data.trainersCount}</p>
          <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs font-medium">
            <span>Capacity at 84%</span>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Daily Attendance</p>
          <p className="text-4xl font-serif italic text-white mt-1">{data.attendanceTodayCount}</p>
          <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-medium">
            <ArrowDownRight className="w-4 h-4" />
            <span>-2% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Analytics SVG Chart */}
        <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-serif text-xl italic text-white">Growth Analytics</h3>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Monthly Facility Revenue ($)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setChartPeriod('week')}
                className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${
                  chartPeriod === 'week' ? 'bg-amber-500 text-black' : 'border border-white/20 text-gray-400 hover:bg-white/10'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setChartPeriod('month')}
                className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded transition-all ${
                  chartPeriod === 'month' ? 'bg-amber-500 text-black' : 'border border-white/20 text-gray-400 hover:bg-white/10'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex items-end gap-2 pt-10 min-h-[200px]">
            <div className="w-full h-44 flex items-end justify-between gap-4">
              {data.revenueChart.map((item, idx) => {
                const maxVal = 50000;
                const heightPct = Math.round((item.revenue / maxVal) * 100);
                return (
                  <div key={idx} className="w-full bg-white/5 rounded-t-lg relative group h-full flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        idx === data.revenueChart.length - 2 ? 'bg-amber-500' : 'bg-amber-500/40 hover:bg-amber-500/70'
                      }`}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none transition-opacity">
                        ${item.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between mt-4 px-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {data.revenueChart.map((item) => (
              <span key={item.month}>{item.month}</span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg italic text-white">Recent Check-ins</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Live</span>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-amber-500">
                  AS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">Aria Stirling</p>
                  <p className="text-xs text-gray-500 truncate">VIP • Cardio Zone</p>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                  MT
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">Marcus Thorne</p>
                  <p className="text-xs text-gray-500 truncate">Standard • Free Weights</p>
                </div>
                <span className="text-[10px] text-gray-400 font-bold bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                  8m ago
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                  EB
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">Elena Belova</p>
                  <p className="text-xs text-gray-500 truncate">Premium • Yoga Studio</p>
                </div>
                <span className="text-[10px] text-gray-400 font-bold bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                  15m ago
                </span>
              </div>

              <div className="flex items-center gap-4 opacity-50">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                  JL
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">Julian Lee</p>
                  <p className="text-xs text-gray-500 truncate">Basic • Check-out</p>
                </div>
                <span className="text-[10px] text-gray-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                  Closed
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/attendance')}
            className="w-full mt-6 py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            View All Activity <ChevronRight className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Secondary Row: Quick Actions & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg italic text-white">Recent Payments</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Latest Recorded Revenues</p>
            </div>
            <button
              onClick={() => onNavigate('/payments')}
              className="text-xs text-amber-500 hover:underline font-bold uppercase tracking-wider"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {data.recentPayments.map((p) => (
              <div key={p.id} className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{p.memberName}</p>
                  <p className="text-xs text-gray-500">{p.membershipName} • {p.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-serif italic text-amber-500 font-bold">+${p.amount}</p>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Health & Gym Operations Summary */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" /> Operations Intelligence
            </div>
            <h3 className="font-serif text-lg italic text-white">Gemini Facility Recommendations</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Based on current peak attendance (Mon 5-8 PM) and member growth (+12%), consider adding 2 additional evening HIIT classes and promoting annual VIP renewals.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">VIP Renewal Rate</p>
                <p className="text-xl font-serif italic text-white mt-0.5">94.2%</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trainer Utilization</p>
                <p className="text-xl font-serif italic text-white mt-0.5">88.5%</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/ai-coach')}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            Open AI Fitness Assistant <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
