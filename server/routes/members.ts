import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db.js';
import { AuthRequest, verifyToken, requireRole } from '../middleware/auth.js';
import { User } from '../../src/types.js';

const router = Router();

// GET /api/members
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, membershipId, trainerId } = req.query;
    const db = await readDB();

    let members = db.users.filter(u => u.role === 'Member');

    if (search) {
      const s = String(search).toLowerCase();
      members = members.filter(m =>
        m.fullName.toLowerCase().includes(s) ||
        m.email.toLowerCase().includes(s) ||
        m.phone.includes(s) ||
        m.username.toLowerCase().includes(s)
      );
    }

    if (status && status !== 'all') {
      members = members.filter(m => m.status === status);
    }

    if (membershipId && membershipId !== 'all') {
      members = members.filter(m => m.membershipId === membershipId);
    }

    if (trainerId && trainerId !== 'all') {
      members = members.filter(m => m.trainerId === trainerId);
    }

    const sanitized = members.map(({ passwordHash, ...rest }) => rest);
    return res.json({ members: sanitized });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch members.' });
  }
});

// GET /api/members/:id
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const member = db.users.find(u => u.id === req.params.id && u.role === 'Member');
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const { passwordHash, ...sanitized } = member;
    return res.json({ member: sanitized });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch member details.' });
  }
});

// POST /api/members (Admin only)
router.post('/', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      fullName,
      username,
      email,
      phone,
      gender,
      dateOfBirth,
      membershipId,
      trainerId,
      address,
      emergencyContact,
      heightCm,
      weightKg
    } = req.body;

    if (!fullName || !email || !username) {
      return res.status(400).json({ error: 'Full name, username, and email are required.' });
    }

    const db = await readDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const defaultPass = await bcrypt.hash('member123', 10);
    const id = `usr-member-${uuidv4().substring(0, 8)}`;

    let membershipName = undefined;
    if (membershipId) {
      const ms = db.memberships.find(m => m.id === membershipId);
      if (ms) membershipName = ms.name;
    }

    let trainerName = undefined;
    if (trainerId) {
      const tr = db.trainers.find(t => t.id === trainerId);
      if (tr) trainerName = tr.fullName;
    }

    let bmi = undefined;
    if (heightCm && weightKg) {
      const hM = heightCm / 100;
      bmi = Number((weightKg / (hM * hM)).toFixed(1));
    }

    const newMember: User = {
      id,
      fullName,
      username,
      email: email.toLowerCase(),
      phone: phone || '',
      gender: gender || 'Other',
      dateOfBirth: dateOfBirth || '2000-01-01',
      passwordHash: defaultPass,
      role: 'Member',
      status: 'Active',
      createdAt: new Date().toISOString(),
      joinDate: new Date().toISOString().split('T')[0],
      membershipId,
      membershipName,
      trainerId,
      trainerName,
      address,
      emergencyContact,
      heightCm,
      weightKg,
      bmi,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`
    };

    db.users.push(newMember);

    // If assigned to a trainer, update trainer record
    if (trainerId) {
      const trainer = db.trainers.find(t => t.id === trainerId);
      if (trainer && !trainer.assignedMemberIds.includes(id)) {
        trainer.assignedMemberIds.push(id);
      }
    }

    await writeDB(db);

    const { passwordHash, ...sanitized } = newMember;
    return res.status(201).json({ message: 'Member created successfully!', member: sanitized });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create member.' });
  }
});

// PUT /api/members/:id
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.users.findIndex(u => u.id === req.params.id && u.role === 'Member');
    if (index === -1) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const updates = req.body;
    delete updates.id;
    delete updates.passwordHash;
    delete updates.role;

    if (updates.membershipId) {
      const ms = db.memberships.find(m => m.id === updates.membershipId);
      if (ms) updates.membershipName = ms.name;
    }

    if (updates.trainerId) {
      const tr = db.trainers.find(t => t.id === updates.trainerId);
      if (tr) updates.trainerName = tr.fullName;
    }

    if (updates.heightCm && updates.weightKg) {
      const hM = updates.heightCm / 100;
      updates.bmi = Number((updates.weightKg / (hM * hM)).toFixed(1));
    }

    db.users[index] = {
      ...db.users[index],
      ...updates
    };

    await writeDB(db);

    const { passwordHash, ...sanitized } = db.users[index];
    return res.json({ message: 'Member updated successfully!', member: sanitized });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update member.' });
  }
});

// DELETE /api/members/:id (Admin only)
router.delete('/:id', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.users.findIndex(u => u.id === req.params.id && u.role === 'Member');
    if (index === -1) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const memberId = db.users[index].id;
    db.users.splice(index, 1);

    // Remove from trainer assignments
    db.trainers.forEach(tr => {
      tr.assignedMemberIds = tr.assignedMemberIds.filter(id => id !== memberId);
    });

    await writeDB(db);
    return res.json({ message: 'Member deleted successfully!' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete member.' });
  }
});

export default router;
