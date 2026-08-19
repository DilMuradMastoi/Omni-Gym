import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db.js';
import { AuthRequest, verifyToken, requireRole } from '../middleware/auth.js';
import { WorkoutPlan } from '../../src/types.js';

const router = Router();

// GET /api/workouts
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { memberId, category, difficulty } = req.query;
    const db = await readDB();
    let workouts = db.workouts;

    // Members see assigned workouts or general workouts
    if (req.user?.role === 'Member') {
      workouts = workouts.filter(w => !w.assignedMemberId || w.assignedMemberId === req.user?.id);
    } else if (memberId) {
      workouts = workouts.filter(w => w.assignedMemberId === memberId);
    }

    if (category && category !== 'all') {
      workouts = workouts.filter(w => w.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      workouts = workouts.filter(w => w.difficulty === difficulty);
    }

    return res.json({ workouts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch workout plans.' });
  }
});

// POST /api/workouts (Trainer/Admin)
router.post('/', verifyToken, requireRole('Trainer', 'Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, difficulty, exercises, durationWeeks, assignedMemberId } = req.body;
    if (!title || !category || !exercises || !Array.isArray(exercises)) {
      return res.status(400).json({ error: 'Title, category, and exercises list are required.' });
    }

    const db = await readDB();

    let assignedMemberName = undefined;
    if (assignedMemberId) {
      const member = db.users.find(u => u.id === assignedMemberId);
      if (member) assignedMemberName = member.fullName;
    }

    const newPlan: WorkoutPlan = {
      id: `wk-${uuidv4().substring(0, 8)}`,
      title,
      category,
      difficulty: difficulty || 'Intermediate',
      durationWeeks: Number(durationWeeks || 4),
      exercises: exercises.map((ex: any, idx: number) => ({
        id: ex.id || `ex-${idx + 1}`,
        name: ex.name,
        sets: Number(ex.sets || 3),
        reps: String(ex.reps || '10'),
        restSec: Number(ex.restSec || 60),
        targetMuscle: ex.targetMuscle || '',
        notes: ex.notes || ''
      })),
      assignedMemberId,
      assignedMemberName,
      createdByTrainerId: req.user?.id || 'admin',
      createdByTrainerName: req.user?.fullName || 'Gym Management',
      createdAt: new Date().toISOString().split('T')[0]
    };

    db.workouts.push(newPlan);
    await writeDB(db);

    return res.status(201).json({ message: 'Workout plan created successfully!', workout: newPlan });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create workout plan.' });
  }
});

// PUT /api/workouts/:id
router.put('/:id', verifyToken, requireRole('Trainer', 'Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.workouts.findIndex(w => w.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Workout plan not found.' });
    }

    const updates = req.body;
    if (updates.assignedMemberId) {
      const member = db.users.find(u => u.id === updates.assignedMemberId);
      if (member) updates.assignedMemberName = member.fullName;
    }

    db.workouts[index] = {
      ...db.workouts[index],
      ...updates
    };

    await writeDB(db);
    return res.json({ message: 'Workout plan updated!', workout: db.workouts[index] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update workout plan.' });
  }
});

// DELETE /api/workouts/:id
router.delete('/:id', verifyToken, requireRole('Trainer', 'Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.workouts.findIndex(w => w.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Workout plan not found.' });
    }

    db.workouts.splice(index, 1);
    await writeDB(db);
    return res.json({ message: 'Workout plan deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete workout plan.' });
  }
});

export default router;
