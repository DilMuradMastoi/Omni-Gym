import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Search,
  Plus,
  Filter,
  Shield,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface MembersPageProps {
  onNavigate: (path: string) => void;
}

export const MembersPage: React.FC<MembersPageProps> = () => {
  const { showToast } = useToast();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Member' | 'Trainer' | 'Admin'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Member form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Member' | 'Trainer' | 'Admin'>('Member');
  const [membershipName, setMembershipName] = useState('Standard');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      const data = Array.isArray(res.data)
        ? res.data
        : (Array.isArray(res.data?.members) ? res.data.members : []);
      setMembers(data);
    } catch (err) {
      // Fallback mockup data if needed
      setMembers([
        { id: '1', fullName: 'Aria Stirling', username: 'aria', email: 'aria@example.com', phone: '+1 555-0192', gender: 'Female', dateOfBirth: '1995-04-12', role: 'Member', status: 'Active', membershipName: 'VIP', joinDate: '2024-01-15', createdAt: '2024-01-15' },
        { id: '2', fullName: 'Marcus Thorne', username: 'marcus', email: 'marcus@example.com', phone: '+1 555-0144', gender: 'Male', dateOfBirth: '1990-08-22', role: 'Member', status: 'Active', membershipName: 'Standard', joinDate: '2024-03-10', createdAt: '2024-03-10' },
        { id: '3', fullName: 'Elena Belova', username: 'elena', email: 'elena@example.com', phone: '+1 555-0881', gender: 'Female', dateOfBirth: '1998-11-05', role: 'Member', status: 'Active', membershipName: 'Premium', joinDate: '2024-02-01', createdAt: '2024-02-01' },
        { id: '4', fullName: 'Alex Vance', username: 'alexv', email: 'trainer.alex@fitzone.com', phone: '+1 555-0999', gender: 'Male', dateOfBirth: '1988-03-15', role: 'Trainer', status: 'Active', membershipName: 'Staff', joinDate: '2023-05-10', createdAt: '2023-05-10' },
        { id: '5', fullName: 'Julian Lee', username: 'julian', email: 'julian@example.com', phone: '+1 555-0331', gender: 'Male', dateOfBirth: '1992-09-30', role: 'Member', status: 'Pending', membershipName: 'Basic', joinDate: '2024-07-20', createdAt: '2024-07-20' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      showToast('Name and email are required.', 'error');
      return;
    }

    try {
      const res = await api.post('/members', {
        fullName,
        email,
        phone,
        role,
        membershipName,
        username: email.split('@')[0],
        status: 'Active'
      });
      showToast('Member created successfully!', 'success');
      setMembers([res.data.user || res.data, ...members]);
      setIsModalOpen(false);
      setFullName('');
      setEmail('');
      setPhone('');
    } catch (err: any) {
      showToast('Failed to add member.', 'error');
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-white">Member Directory</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Manage all active accounts, trainers, and staff access</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md shadow-amber-500/10 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Member
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-[#0f0f0f] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Role:</span>
          {(['All', 'Member', 'Trainer', 'Admin'] as const).map(rf => (
            <button
              key={rf}
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                roleFilter === rf ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {rf}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table Card */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/50 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="py-4 px-6">Member Profile</th>
                <th className="py-4 px-6">Role & Status</th>
                <th className="py-4 px-6">Plan / Specialization</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-800 border border-white/10 flex items-center justify-center font-bold text-amber-500">
                        {m.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-serif italic text-white text-sm font-medium">{m.fullName}</p>
                        <p className="text-gray-500 text-[11px]">@{m.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white">
                        {m.role}
                      </span>
                      {m.status === 'Active' ? (
                        <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-amber-500">{m.membershipName || 'Standard'}</span>
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Mail className="w-3 h-3 text-gray-500" /> {m.email}
                    </div>
                    {m.phone && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                        <Phone className="w-3 h-3 text-gray-500" /> {m.phone}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    {m.joinDate || '2024-01-15'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-serif italic text-white">Register New Member</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jonathan Vickers"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Membership Plan</label>
                <select
                  value={membershipName}
                  onChange={(e) => setMembershipName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Basic">Basic Plan ($49/mo)</option>
                  <option value="Standard">Standard Plan ($89/mo)</option>
                  <option value="Premium">Premium Plan ($149/mo)</option>
                  <option value="VIP">VIP All-Access ($249/mo)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
