import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WorkoutPlan } from '../types';
import { useToast } from '../context/ToastContext';
import { Dumbbell, Plus, Clock, Target, Play, CheckCircle2 } from 'lucide-react';

export const WorkoutsPage: React.FC = () => {
  const { showToast } = useToast();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get('/workouts');
        const data: WorkoutPlan[] = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.workouts) ? res.data.workouts : []);
        setWorkouts(data);
        if (data.length > 0) setSelectedPlan(data[0]);
      } catch (err) {
        const defaults: WorkoutPlan[] = [
          {
            id: 'w1',
            memberId: 'm1',
            memberName: 'Aria Stirling',
            trainerId: 't1',
            trainerName: 'Alex Vance',
            planName: 'Hypertrophy Upper Body Power Phase',
            description: 'Focused on shoulder hypertrophy and chest press explosive velocity.',
            targetGoal: 'Muscle Mass & Strength',
            exercises: [
              { id: 'e1', name: 'Barbell Incline Bench Press', sets: 4, reps: 8, restSeconds: 90, notes: 'Control 3-sec eccentric phase' },
              { id: 'e2', name: 'Weighted Pull-Ups', sets: 4, reps: 6, restSeconds: 120, notes: 'Full lat stretch at bottom' },
              { id: 'e3', name: 'Standing DB Lateral Raises', sets: 3, reps: 12, restSeconds: 60, notes: 'Slight forward lean' },
              { id: 'e4', name: 'Cable Tricep Pushdowns', sets: 3, reps: 15, restSeconds: 45, notes: 'Squeeze tricep peak contraction' }
            ],
            assignedDate: '2026-07-25',
            status: 'Active'
          },
          {
            id: 'w2',
            memberId: 'm2',
            memberName: 'Marcus Thorne',
            trainerId: 't1',
            trainerName: 'Alex Vance',
            planName: 'Posterior Chain & Deadlift Specialization',
            description: 'Heavy hip hinge mechanics and hamstring strengthening.',
            targetGoal: 'Powerlifting Base',
            exercises: [
              { id: 'e5', name: 'Conventional Barbell Deadlift', sets: 5, reps: 5, restSeconds: 180, notes: 'Reset tension every rep' },
              { id: 'e6', name: 'Romanian DB Deadlift', sets: 3, reps: 10, restSeconds: 90, notes: 'Maintain neutral spine' },
              { id: 'e7', name: 'Bulgarian Split Squats', sets: 3, reps: 8, restSeconds: 60, notes: 'Drive through front heel' }
            ],
            assignedDate: '2026-07-28',
            status: 'Active'
          }
        ];
        setWorkouts(defaults);
        setSelectedPlan(defaults[0]);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic text-white">Workout Plans & Routines</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Design, assign, and track member exercise protocols</p>
        </div>

        <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-md shadow-amber-500/10 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Build Routine
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Workout list */}
        <div className="space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Assigned Routines</p>
          {workouts.map((w) => {
            const isSelected = selectedPlan?.id === w.id;
            return (
              <div
                key={w.id}
                onClick={() => setSelectedPlan(w)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#0f0f0f] border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-[#0f0f0f] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {w.targetGoal}
                  </span>
                  <span className="text-[10px] text-gray-500">{w.assignedDate}</span>
                </div>
                <h3 className="font-serif italic text-white text-base">{w.planName}</h3>
                <p className="text-xs text-gray-400 mt-1">For {w.memberName} • By {w.trainerName}</p>
                <div className="mt-3 text-xs text-gray-500 font-medium">
                  {w.exercises.length} Exercises Specified
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Selected Workout Detail */}
        {selectedPlan && (
          <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-white/10 pb-6">
              <div>
                <span className="text-xs text-amber-500 font-bold uppercase tracking-widest">{selectedPlan.targetGoal}</span>
                <h2 className="text-2xl font-serif italic text-white mt-1">{selectedPlan.planName}</h2>
                <p className="text-xs text-gray-400 mt-2">{selectedPlan.description}</p>
              </div>
              <button
                onClick={() => showToast('Routine workout session started!', 'info')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shrink-0"
              >
                <Play className="w-4 h-4" /> Start Workout
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif italic text-lg text-white">Exercise List</h3>

              <div className="space-y-3">
                {selectedPlan.exercises.map((ex, idx) => (
                  <div key={ex.id || idx} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 border border-white/10 flex items-center justify-center text-amber-500 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{ex.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{ex.notes}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <div className="text-right">
                        <span className="text-amber-500 font-bold text-sm">{ex.sets}</span>
                        <span className="text-gray-500 text-[10px] block uppercase">Sets</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-sm">{ex.reps}</span>
                        <span className="text-gray-500 text-[10px] block uppercase">Reps</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-300 font-bold text-sm">{ex.restSeconds}s</span>
                        <span className="text-gray-500 text-[10px] block uppercase">Rest</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
