import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db.js';
import { AuthRequest, verifyToken } from '../middleware/auth.js';
import { AttendanceRecord } from '../../src/types.js';

const router = Router();

// GET /api/attendance
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { date, userId, role } = req.query;
    const db = await readDB();
    let records = db.attendance;

    // Members see only their own attendance unless Admin or Trainer
    if (req.user?.role === 'Member') {
      records = records.filter(r => r.userId === req.user?.id);
    } else if (userId) {
      records = records.filter(r => r.userId === userId);
    }

    if (date) {
      records = records.filter(r => r.date === String(date));
    }

    if (role) {
      records = records.filter(r => r.userRole === role);
    }

    // Sort newest first
    records.sort((a, b) => new Date(`${b.date}T${b.checkInTime}`).getTime() - new Date(`${a.date}T${a.checkInTime}`).getTime());

    return res.json({ attendance: records });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch attendance.' });
  }
});

// POST /api/attendance/check-in
router.post('/check-in', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { memberId } = req.body;
    const targetUserId = memberId || req.user?.id;
    if (!targetUserId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const db = await readDB();
    const user = db.users.find(u => u.id === targetUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];

    // Check if already checked in today without checking out
    const existingActive = db.attendance.find(a => a.userId === targetUserId && a.date === today && a.status === 'Present');

    if (existingActive) {
      return res.status(400).json({ error: `${user.fullName} is already checked in today at ${existingActive.checkInTime}` });
    }

    const newRecord: AttendanceRecord = {
      id: `att-${uuidv4().substring(0, 8)}`,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      date: today,
      checkInTime: nowTime,
      status: 'Present'
    };

    db.attendance.push(newRecord);
    await writeDB(db);

    return res.status(201).json({ message: `${user.fullName} checked in at ${nowTime}`, attendance: newRecord });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to check in.' });
  }
});

// POST /api/attendance/check-out
router.post('/check-out', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { memberId, attendanceId } = req.body;
    const targetUserId = memberId || req.user?.id;
    const db = await readDB();

    let record: AttendanceRecord | undefined;

    if (attendanceId) {
      record = db.attendance.find(a => a.id === attendanceId);
    } else {
      const today = new Date().toISOString().split('T')[0];
      record = db.attendance.find(a => a.userId === targetUserId && a.date === today && a.status === 'Present');
    }

    if (!record) {
      return res.status(404).json({ error: 'Active check-in record not found for today.' });
    }

    const nowTime = new Date().toTimeString().split(' ')[0];
    record.checkOutTime = nowTime;
    record.status = 'Completed';

    // Calculate duration in minutes
    const checkInDate = new Date(`${record.date}T${record.checkInTime}`);
    const checkOutDate = new Date(`${record.date}T${nowTime}`);
    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    record.durationMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

    await writeDB(db);

    return res.json({ message: `${record.userName} checked out at ${nowTime} (${record.durationMinutes} minutes)`, attendance: record });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to check out.' });
  }
});

export default router;
