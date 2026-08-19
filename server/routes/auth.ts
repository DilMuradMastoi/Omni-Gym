import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db.js';
import { AuthRequest, verifyToken } from '../middleware/auth.js';
import { User } from '../../src/types.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gym_management_super_secret_jwt_key_2026';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      phone,
      password,
      confirmPassword,
      gender,
      dateOfBirth,
      role = 'Member',
      membershipId
    } = req.body;

    if (!fullName || !email || !password || !username) {
      return res.status(400).json({ error: 'Full name, username, email, and password are required.' });
    }

    if (password !== confirmPassword && confirmPassword !== undefined) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const db = await readDB();

    const existingEmail = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const existingUsername = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr-${role.toLowerCase()}-${uuidv4().substring(0, 8)}`;

    let userMembershipName = undefined;
    if (membershipId) {
      const m = db.memberships.find(item => item.id === membershipId);
      if (m) userMembershipName = m.name;
    }

    const newUser: User = {
      id: userId,
      fullName,
      username,
      email: email.toLowerCase(),
      phone: phone || '',
      gender: gender || 'Other',
      dateOfBirth: dateOfBirth || '2000-01-01',
      passwordHash: hashedPassword,
      role: role as 'Admin' | 'Trainer' | 'Member',
      status: 'Active',
      createdAt: new Date().toISOString(),
      membershipId,
      membershipName: userMembershipName,
      joinDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`
    };

    db.users.push(newUser);

    // If registered as trainer, also create trainer record
    if (role === 'Trainer') {
      db.trainers.push({
        id: `tr-${uuidv4().substring(0, 8)}`,
        userId: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        specialization: 'General Fitness & Bodybuilding',
        experienceYears: 1,
        salary: 4000,
        assignedMemberIds: [],
        avatarUrl: newUser.avatarUrl,
        status: 'Active'
      });
    }

    await writeDB(db);

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email, fullName: newUser.fullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: 'Registration successful!',
      token,
      user: userWithoutPassword
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = await readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact gym administration.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userWithoutPassword } = user;

    return res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/profile
router.get('/profile', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const user = db.users.find(u => u.id === req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const userIndex = db.users.findIndex(u => u.id === req.user?.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const updates = req.body;
    delete updates.id;
    delete updates.role;
    delete updates.passwordHash;

    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updates
    };

    if (updates.heightCm && updates.weightKg) {
      const hMeters = updates.heightCm / 100;
      db.users[userIndex].bmi = Number((updates.weightKg / (hMeters * hMeters)).toFixed(1));
    }

    await writeDB(db);

    const { passwordHash, ...userWithoutPassword } = db.users[userIndex];
    return res.json({ message: 'Profile updated successfully!', user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
