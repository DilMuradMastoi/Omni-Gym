import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Attendance } from '../types';
import { useToast } from '../context/ToastContext';
import { Clock, CheckCircle2, LogOut, UserCheck, Plus, Search } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<Attendance[]>([]);
  const [memberIdInput, setMemberIdInput] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/attendance');
      const data = Array.isArray(res.data)
        ? res.data
        : (Array.isArray(res.data?.attendance) ? res.data.attendance : []);
      setLogs(data);
    } catch (err) {
      setLogs([
        { id: 'att-1', memberId: 'm1', memberName: 'Aria Stirling', checkInTime: '2026-07-29T08:15:00.000Z', checkOutTime: undefined, date: '2026-07-29', notes: 'Cardio Zone' },
        { id: 'att-2', memberId: 'm2', memberName: 'Marcus Thorne', checkInTime: '2026-07-29T08:02:00.000Z', checkOutTime: undefined, date: '2026-07-29', notes: 'Free Weights' },
        { id: 'att-3', memberId: 'm3', memberName: 'Elena Belova', checkInTime: '2026-07-29T07:45:00.000Z', checkOutTime: '2026-07-29T09:00:00.000Z', date: '2026-07-29', notes: 'Yoga Studio' },
        { id: 'att-4', memberId: 'm5', memberName: 'Julian Lee', checkInTime: '2026-07-28T17:30:00.000Z', checkOutTime: '2026-07-28T19:15:00.000Z', date: '2026-07-28', notes: 'Sauna & Cryo' }
      ]);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberIdInput) return;

    try {
      const res = await api.post('/attendance/check-in', { memberId: memberIdInput });
      showToast('Member checked in successfully!', 'success');
      setLogs([res.data.attendance || res.data, ...logs]);
      setMemberIdInput('');
    } catch (err: any) {
      showToast('Check-in failed.', 'error');
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      await api.post(`/attendance/check-out/${id}`);
      showToast('Member checked out.', 'success');
      setLogs(logs.map(l => l.id === id ? { ...l, checkOutTime: new Date().toISOString() } : l));
    } catch (err) {
      showToast('Check-out failed.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-white">Facility Attendance & Check-in</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Real-time attendance monitoring and member check-in terminal</p>
        </div>

        {/* Quick Check-in Input */}
        <form onSubmit={handleCheckIn} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={memberIdInput}
            onChange={(e) => setMemberIdInput(e.target.value)}
            placeholder="Enter Member ID / Name..."
            className="px-4 py-2 bg-[#0f0f0f] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md transition-all shrink-0"
          >
            Check In
          </button>
        </form>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/50 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="py-4 px-6">Member Name</th>
                <th className="py-4 px-6">Zone / Note</th>
                <th className="py-4 px-6">Check-in Time</th>
                <th className="py-4 px-6">Check-out Time</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {logs.map((log) => {
                const isActive = !log.checkOutTime;
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-serif italic text-white text-sm font-medium">
                      {log.memberName}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {log.notes || 'Gym Floor'}
                    </td>
                    <td className="py-4 px-6 text-amber-500 font-mono text-[11px]">
                      {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-[11px]">
                      {log.checkOutTime
                        ? new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--'}
                    </td>
                    <td className="py-4 px-6">
                      {isActive ? (
                        <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded uppercase tracking-wider">
                          In Facility
                        </span>
                      ) : (
                        <span className="text-gray-500 font-bold text-[10px] bg-white/5 px-2.5 py-1 rounded uppercase tracking-wider">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {isActive && (
                        <button
                          onClick={() => handleCheckOut(log.id)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-rose-400 hover:text-rose-300 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
