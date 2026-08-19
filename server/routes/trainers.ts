import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db.js';
import { AuthRequest, verifyToken, requireRole } from '../middleware/auth.js';
import { Trainer, User } from '../../src/types.js';

const router = Router();

// GET /api/trainers
router.get('/', async (req, res) => {
  try {
    const db = await readDB();
    return res.json({ trainers: db.trainers });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trainers.' });
  }
});

// POST /api/trainers (Admin)
router.post('/', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, email, phone, specialization, experienceYears, salary, bio, username, password } = req.body;
    if (!fullName || !email || !specialization) {
      return res.status(400).json({ error: 'Full name, email, and specialization are required.' });
    }

    const db = await readDB();
    if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'User email already exists.' });
    }

    const passHash = await bcrypt.hash(password || 'trainer123', 10);
    const userId = `usr-trainer-${uuidv4().substring(0, 8)}`;
    const trainerId = `tr-${uuidv4().substring(0, 8)}`;
    const uname = username || email.split('@')[0];

    const newUser: User = {
      id: userId,
      fullName,
      username: uname,
      email: email.toLowerCase(),
      phone: phone || '',
      gender: 'Other',
      dateOfBirth: '1990-01-01',
      passwordHash: passHash,
      role: 'Trainer',
      status: 'Active',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(uname)}`
    };

    const newTrainer: Trainer = {
      id: trainerId,
      userId,
      fullName,
      email: email.toLowerCase(),
      phone: phone || '',
      specialization,
      experienceYears: Number(experienceYears || 1),
      salary: Number(salary || 4000),
      assignedMemberIds: [],
      bio: bio || '',
      avatarUrl: newUser.avatarUrl,
      status: 'Active'
    };

    db.users.push(newUser);
    db.trainers.push(newTrainer);
    await writeDB(db);

    return res.status(201).json({ message: 'Trainer added successfully!', trainer: newTrainer });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add trainer.' });
  }
});

// PUT /api/trainers/:id
router.put('/:id', verifyToken, requireRole('Admin', 'Trainer'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.trainers.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Trainer not found.' });
    }

    db.trainers[index] = {
      ...db.trainers[index],
      ...req.body
    };

    // Keep user table updated
    const userIndex = db.users.findIndex(u => u.id === db.trainers[index].userId);
    if (userIndex !== -1) {
      if (req.body.fullName) db.users[userIndex].fullName = req.body.fullName;
      if (req.body.phone) db.users[userIndex].phone = req.body.phone;
    }

    await writeDB(db);
    return res.json({ message: 'Trainer details updated!', trainer: db.trainers[index] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update trainer.' });
  }
});

// DELETE /api/trainers/:id (Admin)
router.delete('/:id', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.trainers.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Trainer not found.' });
    }

    const trainer = db.trainers[index];
    db.trainers.splice(index, 1);

    // Remove trainer assignment from members
    db.users.forEach(u => {
      if (u.trainerId === trainer.id) {
        u.trainerId = undefined;
        u.trainerName = undefined;
      }
    });

    await writeDB(db);
    return res.json({ message: 'Trainer deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete trainer.' });
  }
});

export default router;
