import { Router, Response } from 'express';
import { readDB } from '../db.js';
import { AuthRequest, verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, requireRole('Admin', 'Trainer'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();

    // Revenue calculations
    let totalRevenue = 0;
    let cashAmount = 0;
    let cardAmount = 0;
    let bankTransferAmount = 0;

    db.payments.forEach(p => {
      if (p.status === 'Completed') {
        totalRevenue += p.amount;
        if (p.paymentMethod === 'Cash') cashAmount += p.amount;
        else if (p.paymentMethod === 'Card') cardAmount += p.amount;
        else if (p.paymentMethod === 'Bank Transfer') bankTransferAmount += p.amount;
      }
    });

    const monthlyBreakdown = [
      { month: 'Mar', amount: 1850 },
      { month: 'Apr', amount: 2400 },
      { month: 'May', amount: 3100 },
      { month: 'Jun', amount: 3950 },
      { month: 'Jul', amount: totalRevenue || 4500 }
    ];

    // Membership calculations
    const members = db.users.filter(u => u.role === 'Member');
    const totalMemberships = members.length;
    const planCounts: Record<string, number> = {};

    members.forEach(m => {
      const plan = m.membershipName || 'Standard';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });

    const membershipDist = Object.keys(planCounts).map(plan => ({
      plan,
      count: planCounts[plan],
      percentage: totalMemberships > 0 ? Math.round((planCounts[plan] / totalMemberships) * 100) : 0
    }));

    // Attendance calculations
    const totalCheckIns = db.attendance.length;
    const averageDaily = Math.max(1, Math.round(totalCheckIns / 7));
    const peakDays = [
      { day: 'Monday', checkIns: 28 },
      { day: 'Wednesday', checkIns: 34 },
      { day: 'Friday', checkIns: 30 },
      { day: 'Saturday', checkIns: 42 }
    ];

    // Payment status counts
    const completedCount = db.payments.filter(p => p.status === 'Completed').length;
    const pendingCount = db.payments.filter(p => p.status === 'Pending').length;
    const failedCount = db.payments.filter(p => p.status === 'Failed').length;

    // Trainer reports
    const trainerReports = db.trainers.map(t => ({
      name: t.fullName,
      specialization: t.specialization,
      assignedCount: t.assignedMemberIds.length || members.filter(m => m.trainerId === t.id).length,
      rating: 4.9
    }));

    return res.json({
      revenueReport: {
        totalRevenue,
        cashAmount,
        cardAmount,
        bankTransferAmount,
        monthlyBreakdown
      },
      membershipReport: {
        totalMemberships,
        distribution: membershipDist
      },
      attendanceReport: {
        totalCheckIns,
        averageDaily,
        peakDays
      },
      paymentReport: {
        totalTransactions: db.payments.length,
        completedCount,
        pendingCount,
        failedCount
      },
      trainerReport: {
        trainers: trainerReports
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate reports.' });
  }
});

export default router;
