import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Membership, Trainer, AttendanceRecord, WorkoutPlan, PaymentRecord } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'gym_db.json');

export interface DBData {
  users: User[];
  memberships: Membership[];
  trainers: Trainer[];
  attendance: AttendanceRecord[];
  workouts: WorkoutPlan[];
  payments: PaymentRecord[];
}

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function getSeedData(): Promise<DBData> {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const trainerPassword = await bcrypt.hash('trainer123', 10);
  const memberPassword = await bcrypt.hash('member123', 10);

  const memberships: Membership[] = [
    {
      id: 'mship-1',
      name: 'Basic',
      price: 29,
      durationMonths: 1,
      benefits: ['Access to Gym Floor', 'Locker Room Access', '1 Group Class / week'],
      status: 'Active',
      popular: false
    },
    {
      id: 'mship-2',
      name: 'Standard',
      price: 59,
      durationMonths: 1,
      benefits: ['Full Gym Access 24/7', 'Unlimited Group Classes', 'Sauna & Spa', '1 Complimentary Trainer Session'],
      status: 'Active',
      popular: true
    },
    {
      id: 'mship-3',
      name: 'Premium',
      price: 99,
      durationMonths: 3,
      benefits: ['All Standard Benefits', 'Personalized Workout Plan', 'Diet & Nutrition Blueprint', 'Guest Passes (2/mo)'],
      status: 'Active',
      popular: false
    },
    {
      id: 'mship-4',
      name: 'VIP',
      price: 149,
      durationMonths: 6,
      benefits: ['All Premium Benefits', 'Dedicated Personal Trainer', 'Private Locker & Towel Service', 'Free Supplement Package'],
      status: 'Active',
      popular: false
    }
  ];

  const users: User[] = [
    {
      id: 'usr-admin-1',
      fullName: 'Chief Admin',
      username: 'admin',
      email: 'admin@fitzone.com',
      phone: '+1 (555) 019-2831',
      gender: 'Male',
      dateOfBirth: '1988-04-12',
      passwordHash: adminPassword,
      role: 'Admin',
      status: 'Active',
      createdAt: '2025-01-01T08:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-trainer-1',
      fullName: 'Alex Rivera',
      username: 'alex_rivera',
      email: 'trainer.alex@fitzone.com',
      phone: '+1 (555) 392-1049',
      gender: 'Male',
      dateOfBirth: '1992-08-15',
      passwordHash: trainerPassword,
      role: 'Trainer',
      status: 'Active',
      createdAt: '2025-01-10T10:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-trainer-2',
      fullName: 'Sarah Chen',
      username: 'sarah_chen',
      email: 'trainer.sarah@fitzone.com',
      phone: '+1 (555) 839-2041',
      gender: 'Female',
      dateOfBirth: '1995-11-22',
      passwordHash: trainerPassword,
      role: 'Trainer',
      status: 'Active',
      createdAt: '2025-01-15T09:30:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-trainer-3',
      fullName: 'Marcus Vance',
      username: 'marcus_vance',
      email: 'trainer.marcus@fitzone.com',
      phone: '+1 (555) 492-8102',
      gender: 'Male',
      dateOfBirth: '1990-03-05',
      passwordHash: trainerPassword,
      role: 'Trainer',
      status: 'Active',
      createdAt: '2025-02-01T11:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-member-1',
      fullName: 'David Miller',
      username: 'david_miller',
      email: 'member.david@fitzone.com',
      phone: '+1 (555) 294-8103',
      gender: 'Male',
      dateOfBirth: '1996-05-18',
      passwordHash: memberPassword,
      role: 'Member',
      status: 'Active',
      membershipId: 'mship-3',
      membershipName: 'Premium',
      membershipEndDate: '2026-10-15',
      trainerId: 'tr-1',
      trainerName: 'Alex Rivera',
      joinDate: '2025-02-10',
      address: '742 Evergreen Terrace, Springfield',
      emergencyContact: 'Laura Miller (+1 555 901-2234)',
      bmi: 23.4,
      heightCm: 178,
      weightKg: 74,
      createdAt: '2025-02-10T14:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-member-2',
      fullName: 'Emily Watson',
      username: 'emily_watson',
      email: 'member.emily@fitzone.com',
      phone: '+1 (555) 912-3048',
      gender: 'Female',
      dateOfBirth: '1998-09-30',
      passwordHash: memberPassword,
      role: 'Member',
      status: 'Active',
      membershipId: 'mship-4',
      membershipName: 'VIP',
      membershipEndDate: '2026-12-01',
      trainerId: 'tr-2',
      trainerName: 'Sarah Chen',
      joinDate: '2025-01-20',
      address: '104 Ocean Drive, Miami',
      emergencyContact: 'Mark Watson (+1 555 492-1029)',
      bmi: 21.2,
      heightCm: 165,
      weightKg: 58,
      createdAt: '2025-01-20T16:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-member-3',
      fullName: 'James Vance',
      username: 'james_vance',
      email: 'member.james@fitzone.com',
      phone: '+1 (555) 304-9210',
      gender: 'Male',
      dateOfBirth: '1994-01-12',
      passwordHash: memberPassword,
      role: 'Member',
      status: 'Active',
      membershipId: 'mship-1',
      membershipName: 'Basic',
      membershipEndDate: '2026-08-10',
      trainerId: 'tr-3',
      trainerName: 'Marcus Vance',
      joinDate: '2025-03-01',
      address: '52 Wall Street, NY',
      emergencyContact: 'Helen Vance (+1 555 830-1049)',
      bmi: 26.1,
      heightCm: 182,
      weightKg: 86,
      createdAt: '2025-03-01T10:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
    },
    {
      id: 'usr-member-4',
      fullName: 'Sophia Martinez',
      username: 'sophia_m',
      email: 'member.sophia@fitzone.com',
      phone: '+1 (555) 203-9182',
      gender: 'Female',
      dateOfBirth: '2000-07-04',
      passwordHash: memberPassword,
      role: 'Member',
      status: 'Active',
      membershipId: 'mship-2',
      membershipName: 'Standard',
      membershipEndDate: '2026-09-20',
      joinDate: '2025-03-15',
      address: '404 Pine St, Seattle',
      emergencyContact: 'Maria Martinez (+1 555 930-1920)',
      bmi: 22.0,
      heightCm: 168,
      weightKg: 62,
      createdAt: '2025-03-15T11:00:00Z',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
    }
  ];

  const trainers: Trainer[] = [
    {
      id: 'tr-1',
      userId: 'usr-trainer-1',
      fullName: 'Alex Rivera',
      email: 'trainer.alex@fitzone.com',
      phone: '+1 (555) 392-1049',
      specialization: 'Hypertrophy & Powerlifting',
      experienceYears: 7,
      salary: 5400,
      assignedMemberIds: ['usr-member-1'],
      avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=250&q=80',
      bio: 'Certified CSCS coach specializing in muscle hypertrophy, Olympic lifting, and injury rehabilitation.',
      status: 'Active'
    },
    {
      id: 'tr-2',
      userId: 'usr-trainer-2',
      fullName: 'Sarah Chen',
      email: 'trainer.sarah@fitzone.com',
      phone: '+1 (555) 839-2041',
      specialization: 'Yoga, Mobility & Pilates',
      experienceYears: 5,
      salary: 4800,
      assignedMemberIds: ['usr-member-2'],
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      bio: 'Holistic movement specialist helping clients reach peak flexibility and core power.',
      status: 'Active'
    },
    {
      id: 'tr-3',
      userId: 'usr-trainer-3',
      fullName: 'Marcus Vance',
      email: 'trainer.marcus@fitzone.com',
      phone: '+1 (555) 492-8102',
      specialization: 'HIIT & Fat Loss Transformation',
      experienceYears: 6,
      salary: 5100,
      assignedMemberIds: ['usr-member-3'],
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      bio: 'High-energy tactical fitness coach delivering intense metabolic conditioning.',
      status: 'Active'
    }
  ];

  const today = new Date().toISOString().split('T')[0];

  const attendance: AttendanceRecord[] = [
    {
      id: 'att-1',
      userId: 'usr-member-1',
      userName: 'David Miller',
      userRole: 'Member',
      date: today,
      checkInTime: '06:30:15',
      checkOutTime: '08:00:10',
      durationMinutes: 90,
      status: 'Completed'
    },
    {
      id: 'att-2',
      userId: 'usr-member-2',
      userName: 'Emily Watson',
      userRole: 'Member',
      date: today,
      checkInTime: '07:15:00',
      checkOutTime: undefined,
      durationMinutes: undefined,
      status: 'Present'
    },
    {
      id: 'att-3',
      userId: 'usr-trainer-1',
      userName: 'Alex Rivera',
      userRole: 'Trainer',
      date: today,
      checkInTime: '06:00:00',
      checkOutTime: undefined,
      status: 'Present'
    },
    {
      id: 'att-4',
      userId: 'usr-member-3',
      userName: 'James Vance',
      userRole: 'Member',
      date: '2026-07-28',
      checkInTime: '17:45:00',
      checkOutTime: '19:00:00',
      durationMinutes: 75,
      status: 'Completed'
    }
  ];

  const workouts: WorkoutPlan[] = [
    {
      id: 'wk-1',
      title: 'Hypertrophy Upper Body Power',
      category: 'Strength',
      difficulty: 'Intermediate',
      durationWeeks: 6,
      assignedMemberId: 'usr-member-1',
      assignedMemberName: 'David Miller',
      createdByTrainerId: 'usr-trainer-1',
      createdByTrainerName: 'Alex Rivera',
      createdAt: '2026-07-20',
      exercises: [
        { id: 'ex-1', name: 'Barbell Bench Press', sets: 4, reps: '8-10', restSec: 90, targetMuscle: 'Chest' },
        { id: 'ex-2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSec: 60, targetMuscle: 'Upper Chest' },
        { id: 'ex-3', name: 'Lat Pulldowns', sets: 4, reps: '10', restSec: 75, targetMuscle: 'Lats' },
        { id: 'ex-4', name: 'Overhead Shoulder Press', sets: 3, reps: '8-10', restSec: 90, targetMuscle: 'Deltoids' },
        { id: 'ex-5', name: 'Tricep Rope Pushdowns', sets: 3, reps: '12-15', restSec: 45, targetMuscle: 'Triceps' }
      ]
    },
    {
      id: 'wk-2',
      title: 'Vinyasa Core & Balance Flow',
      category: 'Yoga',
      difficulty: 'Beginner',
      durationWeeks: 4,
      assignedMemberId: 'usr-member-2',
      assignedMemberName: 'Emily Watson',
      createdByTrainerId: 'usr-trainer-2',
      createdByTrainerName: 'Sarah Chen',
      createdAt: '2026-07-22',
      exercises: [
        { id: 'ex-6', name: 'Sun Salutation A', sets: 5, reps: 'Flow', restSec: 30, targetMuscle: 'Full Body' },
        { id: 'ex-7', name: 'Warrior II & Reverse Warrior', sets: 3, reps: '60s hold', restSec: 45, targetMuscle: 'Lower Body' },
        { id: 'ex-8', name: 'Plank to Dolphin Pose', sets: 4, reps: '12', restSec: 45, targetMuscle: 'Core & Shoulders' },
        { id: 'ex-9', name: 'Tree Pose Balance', sets: 3, reps: '45s/side', restSec: 30, targetMuscle: 'Stabilizers' }
      ]
    },
    {
      id: 'wk-3',
      title: 'Metabolic Shred 500',
      category: 'HIIT',
      difficulty: 'Advanced',
      durationWeeks: 4,
      assignedMemberId: 'usr-member-3',
      assignedMemberName: 'James Vance',
      createdByTrainerId: 'usr-trainer-3',
      createdByTrainerName: 'Marcus Vance',
      createdAt: '2026-07-25',
      exercises: [
        { id: 'ex-10', name: 'Kettlebell Swings', sets: 5, reps: '20', restSec: 30, targetMuscle: 'Posterior Chain' },
        { id: 'ex-11', name: 'Burpee Box Jumps', sets: 4, reps: '15', restSec: 45, targetMuscle: 'Explosive Cardio' },
        { id: 'ex-12', name: 'Battle Rope Waves', sets: 4, reps: '45 sec', restSec: 30, targetMuscle: 'Upper Body Cardio' }
      ]
    }
  ];

  const payments: PaymentRecord[] = [
    {
      id: 'pay-1',
      memberId: 'usr-member-1',
      memberName: 'David Miller',
      membershipId: 'mship-3',
      membershipName: 'Premium',
      amount: 99,
      paymentMethod: 'Card',
      paymentDate: '2026-07-15',
      status: 'Completed',
      transactionId: 'TXN-94029102'
    },
    {
      id: 'pay-2',
      memberId: 'usr-member-2',
      memberName: 'Emily Watson',
      membershipId: 'mship-4',
      membershipName: 'VIP',
      amount: 149,
      paymentMethod: 'Card',
      paymentDate: '2026-07-18',
      status: 'Completed',
      transactionId: 'TXN-83920194'
    },
    {
      id: 'pay-3',
      memberId: 'usr-member-3',
      memberName: 'James Vance',
      membershipId: 'mship-1',
      membershipName: 'Basic',
      amount: 29,
      paymentMethod: 'Cash',
      paymentDate: '2026-07-20',
      status: 'Completed',
      transactionId: 'TXN-10492049'
    },
    {
      id: 'pay-4',
      memberId: 'usr-member-4',
      memberName: 'Sophia Martinez',
      membershipId: 'mship-2',
      membershipName: 'Standard',
      amount: 59,
      paymentMethod: 'Bank Transfer',
      paymentDate: '2026-07-26',
      status: 'Completed',
      transactionId: 'TXN-59403910'
    }
  ];

  return { users, memberships, trainers, attendance, workouts, payments };
}

export async function readDB(): Promise<DBData> {
  ensureDirectoryExists();
  if (!fs.existsSync(DB_FILE)) {
    const seed = await getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, re-seeding:', err);
    const seed = await getSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

export async function writeDB(data: DBData): Promise<void> {
  ensureDirectoryExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
