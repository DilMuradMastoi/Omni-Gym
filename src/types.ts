export type UserRole = 'Admin' | 'Trainer' | 'Member';

export interface User {
  id: string;
  name: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  // Member specific
  membershipId?: string;
  membershipName?: string;
  membershipEndDate?: string;
  trainerId?: string;
  trainerName?: string;
  joinDate?: string;
  address?: string;
  emergencyContact?: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Expired';
  bmi?: number;
  heightCm?: number;
  weightKg?: number;
}

export interface Membership {
  id: string;
  name: 'Basic' | 'Standard' | 'Premium' | 'VIP' | string;
  price: number;
  durationMonths: number;
  benefits: string[];
  status: 'Active' | 'Inactive' | 'Suspended';
  popular?: boolean;
}

export interface Trainer {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  salary: number;
  assignedMemberIds: string[];
  avatarUrl?: string;
  bio?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm:ss
  checkOutTime?: string;
  durationMinutes?: number;
  status: 'Present' | 'Completed';
}

export type Attendance = AttendanceRecord | {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
  notes?: string;
};

export type Payment = PaymentRecord;

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  restSec?: number;
  restSeconds?: number;
  targetMuscle?: string;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  title?: string;
  planName?: string;
  category?: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga' | 'Hypertrophy' | 'Recovery' | string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  targetGoal?: string;
  description?: string;
  exercises: Exercise[];
  durationWeeks?: number;
  memberId?: string;
  memberName?: string;
  trainerId?: string;
  trainerName?: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  createdByTrainerId?: string;
  createdByTrainerName?: string;
  assignedDate?: string;
  status?: string;
  createdAt?: string;
}

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  membershipId: string;
  membershipName: string;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer';
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Failed';
  transactionId: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  trainersCount: number;
  monthlyRevenue: number;
  paymentsReceivedCount: number;
  pendingPaymentsAmount: number;
  attendanceTodayCount: number;
  workoutPlansCount: number;
  newRegistrationsCount: number;
  recentPayments: PaymentRecord[];
  revenueChart: { month: string; revenue: number; target: number }[];
  attendanceChart: { day: string; count: number }[];
  membershipDistribution: { name: string; value: number }[];
}

export interface ReportData {
  revenueReport: {
    totalRevenue: number;
    cashAmount: number;
    cardAmount: number;
    bankTransferAmount: number;
    monthlyBreakdown: { month: string; amount: number }[];
  };
  membershipReport: {
    totalMemberships: number;
    distribution: { plan: string; count: number; percentage: number }[];
  };
  attendanceReport: {
    totalCheckIns: number;
    averageDaily: number;
    peakDays: { day: string; checkIns: number }[];
  };
  paymentReport: {
    totalTransactions: number;
    completedCount: number;
    pendingCount: number;
    failedCount: number;
  };
  trainerReport: {
    trainers: { name: string; specialization: string; assignedCount: number; rating: number }[];
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
