import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db.js';
import { AuthRequest, verifyToken, requireRole } from '../middleware/auth.js';
import { Membership } from '../../src/types.js';

const router = Router();

// GET /api/memberships
router.get('/', async (req, res) => {
  try {
    const db = await readDB();
    return res.json({ memberships: db.memberships });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch memberships.' });
  }
});

// POST /api/memberships (Admin)
router.post('/', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, durationMonths, benefits, popular } = req.body;
    if (!name || price === undefined || !durationMonths) {
      return res.status(400).json({ error: 'Membership name, price, and duration are required.' });
    }

    const db = await readDB();
    const newMembership: Membership = {
      id: `mship-${uuidv4().substring(0, 6)}`,
      name,
      price: Number(price),
      durationMonths: Number(durationMonths),
      benefits: Array.isArray(benefits) ? benefits : [benefits],
      status: 'Active',
      popular: !!popular
    };

    db.memberships.push(newMembership);
    await writeDB(db);

    return res.status(201).json({ message: 'Membership plan created!', membership: newMembership });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create membership.' });
  }
});

// PUT /api/memberships/:id (Admin)
router.put('/:id', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.memberships.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Membership plan not found.' });
    }

    db.memberships[index] = {
      ...db.memberships[index],
      ...req.body
    };

    await writeDB(db);
    return res.json({ message: 'Membership plan updated!', membership: db.memberships[index] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update membership.' });
  }
});

// DELETE /api/memberships/:id (Admin)
router.delete('/:id', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.memberships.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Membership plan not found.' });
    }

    db.memberships.splice(index, 1);
    await writeDB(db);
    return res.json({ message: 'Membership plan deleted!' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete membership.' });
  }
});

// POST /api/memberships/:id/activate
router.post('/:id/activate', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const m = db.memberships.find(item => item.id === req.params.id);
    if (!m) return res.status(404).json({ error: 'Plan not found.' });

    m.status = 'Active';
    await writeDB(db);
    return res.json({ message: 'Membership activated.', membership: m });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to activate membership.' });
  }
});

// POST /api/memberships/:id/suspend
router.post('/:id/suspend', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const m = db.memberships.find(item => item.id === req.params.id);
    if (!m) return res.status(404).json({ error: 'Plan not found.' });

    m.status = 'Suspended';
    await writeDB(db);
    return res.json({ message: 'Membership suspended.', membership: m });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to suspend membership.' });
  }
});

// POST /api/memberships/:id/renew
router.post('/:id/renew', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { memberId } = req.body;
    const db = await readDB();
    const targetUserId = memberId || req.user?.id;
    const user = db.users.find(u => u.id === targetUserId);

    if (!user) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    const membership = db.memberships.find(m => m.id === req.params.id);
    if (!membership) {
      return res.status(404).json({ error: 'Membership plan not found.' });
    }

    // Renew by adding months to end date
    const d = new Date();
    d.setMonth(d.getMonth() + membership.durationMonths);
    const newEndDate = d.toISOString().split('T')[0];

    user.membershipId = membership.id;
    user.membershipName = membership.name;
    user.membershipEndDate = newEndDate;
    user.status = 'Active';

    // Record renewal payment automatically
    const paymentId = `pay-${uuidv4().substring(0, 8)}`;
    db.payments.push({
      id: paymentId,
      memberId: user.id,
      memberName: user.fullName,
      membershipId: membership.id,
      membershipName: membership.name,
      amount: membership.price,
      paymentMethod: 'Card',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      transactionId: `TXN-RENEW-${uuidv4().substring(0, 6).toUpperCase()}`
    });

    await writeDB(db);
    return res.json({
      message: `Membership ${membership.name} renewed until ${newEndDate}!`,
      user: {
        id: user.id,
        membershipId: user.membershipId,
        membershipName: user.membershipName,
        membershipEndDate: user.membershipEndDate
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to renew membership.' });
  }
});

export default router;
