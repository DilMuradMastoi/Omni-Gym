import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-white">Reports & Financial Analytics</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Facility throughput, revenue forecasts, and membership retention metrics</p>
        </div>

        <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Financial PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Q3 Projected Revenue</p>
          <p className="text-3xl font-serif italic text-white mt-1">$138,500</p>
          <p className="text-xs text-emerald-400 mt-2 font-bold">+14.2% YoY growth</p>
        </div>
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Churn Rate</p>
          <p className="text-3xl font-serif italic text-amber-500 mt-1">1.8%</p>
          <p className="text-xs text-gray-400 mt-2 font-bold">Industry benchmark: 4.5%</p>
        </div>
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Peak Utilization</p>
          <p className="text-3xl font-serif italic text-white mt-1">92%</p>
          <p className="text-xs text-gray-400 mt-2 font-bold">Mon & Wed 6:00 PM</p>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 space-y-6">
        <h3 className="font-serif italic text-xl text-white">Monthly Attendance Breakdown</h3>
        <div className="h-48 flex items-end justify-between gap-4 pt-6 border-b border-white/10 pb-4">
          {[
            { month: 'Jan', count: 4200 },
            { month: 'Feb', count: 4800 },
            { month: 'Mar', count: 5100 },
            { month: 'Apr', count: 5600 },
            { month: 'May', count: 6200 },
            { month: 'Jun', count: 6900 },
            { month: 'Jul', count: 7400 }
          ].map((item, idx) => (
            <div key={idx} className="w-full flex flex-col items-center gap-2">
              <div
                style={{ height: `${(item.count / 8000) * 100}%` }}
                className="w-full max-w-[40px] bg-amber-500/30 hover:bg-amber-500 rounded-t-lg transition-all"
              />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
