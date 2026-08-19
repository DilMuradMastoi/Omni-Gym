import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Payment } from '../types';
import { useToast } from '../context/ToastContext';
import { DollarSign, Plus, CreditCard, CheckCircle2, Search, Filter } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      const data = Array.isArray(res.data)
        ? res.data
        : (Array.isArray(res.data?.payments) ? res.data.payments : []);
      setPayments(data);
    } catch (err) {
      setPayments([
        { id: '1', memberId: 'm1', memberName: 'Aria Stirling', membershipId: 'p1', membershipName: 'VIP Membership', amount: 249, paymentMethod: 'Card', paymentDate: '2026-07-29', status: 'Completed', transactionId: 'TX-90812' },
        { id: '2', memberId: 'm2', memberName: 'Marcus Thorne', membershipId: 'p2', membershipName: 'Standard Plan', amount: 89, paymentMethod: 'Cash', paymentDate: '2026-07-29', status: 'Completed', transactionId: 'TX-90813' },
        { id: '3', memberId: 'm3', memberName: 'Elena Belova', membershipId: 'p3', membershipName: 'Premium Pass', amount: 149, paymentMethod: 'Card', paymentDate: '2026-07-28', status: 'Completed', transactionId: 'TX-90814' },
        { id: '4', memberId: 'm5', memberName: 'Julian Lee', membershipId: 'p4', membershipName: 'Basic Plan', amount: 49, paymentMethod: 'Bank Transfer', paymentDate: '2026-07-27', status: 'Pending', transactionId: 'TX-90815' }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-white">Payment Transactions</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Billing history, cash/card revenues, and pending invoices</p>
        </div>

        <button
          onClick={() => showToast('Payment collection terminal opened', 'info')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Record New Payment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Monthly Volume</p>
          <p className="text-3xl font-serif italic text-white mt-1">$42,190.00</p>
          <p className="text-[11px] text-emerald-400 font-bold mt-2">+8.4% growth</p>
        </div>
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Successful Charges</p>
          <p className="text-3xl font-serif italic text-amber-500 mt-1">142</p>
          <p className="text-[11px] text-gray-400 mt-2">Card & Cash settlement</p>
        </div>
        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Pending Receivables</p>
          <p className="text-3xl font-serif italic text-rose-400 mt-1">$1,850.00</p>
          <p className="text-[11px] text-gray-400 mt-2">12 invoices pending</p>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/50 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Member Name</th>
                <th className="py-4 px-6">Tier</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono text-[11px] text-gray-400">{p.transactionId}</td>
                  <td className="py-4 px-6 font-serif italic text-white text-sm">{p.memberName}</td>
                  <td className="py-4 px-6 text-amber-500">{p.membershipName}</td>
                  <td className="py-4 px-6 font-serif italic text-white font-bold text-sm">${p.amount}</td>
                  <td className="py-4 px-6 text-gray-400">{p.paymentMethod}</td>
                  <td className="py-4 px-6 text-gray-500">{p.paymentDate}</td>
                  <td className="py-4 px-6 text-right">
                    {p.status === 'Completed' ? (
                      <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded uppercase tracking-wider">
                        Completed
                      </span>
                    ) : (
                      <span className="text-amber-500 font-bold text-[10px] bg-amber-500/10 px-2.5 py-1 rounded uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
