import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trainer } from '../types';
import { UserCheck, Star, Mail, Phone, Award, Users, Plus, Shield } from 'lucide-react';

export const TrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await api.get('/trainers');
        const data = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.trainers) ? res.data.trainers : []);
        setTrainers(data);
      } catch (err) {
        setTrainers([
          {
            id: 't1',
            userId: 'u4',
            fullName: 'Alex Vance',
            email: 'trainer.alex@fitzone.com',
            phone: '+1 555-0999',
            specialization: 'Hypertrophy & Strength Conditioning',
            experienceYears: 7,
            salary: 4500,
            assignedMemberIds: ['m1', 'm2', 'm3'],
            bio: 'Certified CSCS strength coach specializing in Olympic lifting and muscle hypertrophy.',
            status: 'Active'
          },
          {
            id: 't2',
            userId: 'u6',
            fullName: 'Sophia Martinez',
            email: 'sophia@fitzone.com',
            phone: '+1 555-0777',
            specialization: 'HIIT & Functional Athletics',
            experienceYears: 5,
            salary: 4200,
            assignedMemberIds: ['m4', 'm5'],
            bio: 'Expert in high-intensity functional training and endurance bio-mechanics.',
            status: 'Active'
          },
          {
            id: 't3',
            userId: 'u7',
            fullName: 'David Sterling',
            email: 'david.s@fitzone.com',
            phone: '+1 555-0333',
            specialization: 'Mobility & Reconstructive Rehab',
            experienceYears: 9,
            salary: 5200,
            assignedMemberIds: ['m6'],
            bio: 'Physiotherapist & mobility specialist focusing on joint longevity and injury rehab.',
            status: 'Active'
          }
        ]);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-white">Fitness Trainers</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Certified coaching staff, specialization areas, and active assigned members</p>
        </div>

        <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md shadow-amber-500/10 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Trainer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainers.map((t) => (
          <div key={t.id} className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-white/10 flex items-center justify-center font-bold text-amber-500 text-lg">
                  {t.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif italic text-white text-lg">{t.fullName}</h3>
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {t.specialization}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">{t.bio}</p>

              <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Experience:</span>
                  <span className="text-white font-medium">{t.experienceYears} Years</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Assigned Members:</span>
                  <span className="text-amber-500 font-bold">{t.assignedMemberIds.length} Active</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">{t.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2">
              <a href={`mailto:${t.email}`} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest text-center">
                Contact
              </a>
              <button className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-[11px] font-bold uppercase tracking-widest text-center">
                View Clients
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
