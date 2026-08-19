import React, { useState } from 'react';
import { Membership } from '../types';
import { useToast } from '../context/ToastContext';
import { Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const MembershipsPage: React.FC = () => {
  const { showToast } = useToast();
  const [activePlanId, setActivePlanId] = useState<string>('p3');

  const plans: Membership[] = [
    {
      id: 'p1',
      name: 'Basic',
      price: 49,
      durationMonths: 1,
      benefits: [
        'Gym Floor Access (Standard Hours)',
        'Locker Room & Shower Access',
        '1 Free Fitness Evaluation',
        'FitZone App Trackers'
      ],
      status: 'Active'
    },
    {
      id: 'p2',
      name: 'Standard',
      price: 89,
      durationMonths: 1,
      benefits: [
        '24/7 Unlimited Gym Access',
        'Group Fitness & Yoga Classes',
        'Locker Room & Sauna Access',
        'FitZone App Workout Plans',
        '1 Personal Trainer Consultation'
      ],
      status: 'Active'
    },
    {
      id: 'p3',
      name: 'Premium',
      price: 149,
      durationMonths: 1,
      benefits: [
        'All Standard Tier Benefits',
        'Unlimited Recovery & Cryotherapy',
        '2 Personal Training Sessions / mo',
        'AI Fitness Coach Unlimited',
        'Guest Pass (2 per month)'
      ],
      status: 'Active',
      popular: true
    },
    {
      id: 'p4',
      name: 'VIP',
      price: 249,
      durationMonths: 1,
      benefits: [
        'All Premium Benefits Included',
        'Dedicated Private Trainer',
        'Customized Nutrition Planning',
        'VIP Lounge & Towel Service',
        'Unlimited Guest Access'
      ],
      status: 'Active'
    }
  ];

  const handleSelectPlan = (plan: Membership) => {
    setActivePlanId(plan.id);
    showToast(`Selected ${plan.name} Membership Plan`, 'success');
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Operations Pricing & Tiers
        </div>
        <h1 className="text-3xl font-serif italic text-white">Membership Plans</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Select or update facility membership tiers for your gym members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isSelected = activePlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-[#0f0f0f] border-2 border-amber-500 shadow-xl shadow-amber-500/10 scale-105 z-10'
                  : 'bg-[#0f0f0f] border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-serif italic text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-serif italic text-amber-500 font-bold">${plan.price}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">/ month</span>
                </div>

                <div className="space-y-3 my-6 border-t border-white/10 pt-6">
                  {plan.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {isSelected ? 'Current Active Tier' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
