import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readDB, writeDB } from '../db.js';
import { AuthRequest, verifyToken, requireRole } from '../middleware/auth.js';
import { PaymentRecord } from '../../src/types.js';

const router = Router();

// GET /api/payments
router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { search, method, status } = req.query;
    const db = await readDB();
    let payments = db.payments;

    // Members see only their own payment records
    if (req.user?.role === 'Member') {
      payments = payments.filter(p => p.memberId === req.user?.id);
    }

    if (search) {
      const s = String(search).toLowerCase();
      payments = payments.filter(p =>
        p.memberName.toLowerCase().includes(s) ||
        p.transactionId.toLowerCase().includes(s) ||
        p.membershipName.toLowerCase().includes(s)
      );
    }

    if (method && method !== 'all') {
      payments = payments.filter(p => p.paymentMethod === method);
    }

    if (status && status !== 'all') {
      payments = payments.filter(p => p.status === status);
    }

    // Newest first
    payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

    return res.json({ payments });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch payments.' });
  }
});

// POST /api/payments (Admin)
router.post('/', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { memberId, membershipId, amount, paymentMethod, paymentDate, status } = req.body;
    if (!memberId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Member, amount, and payment method are required.' });
    }

    const db = await readDB();
    const member = db.users.find(u => u.id === memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    let membershipName = 'Custom Plan';
    if (membershipId) {
      const ms = db.memberships.find(m => m.id === membershipId);
      if (ms) membershipName = ms.name;
    }

    const newPayment: PaymentRecord = {
      id: `pay-${uuidv4().substring(0, 8)}`,
      memberId: member.id,
      memberName: member.fullName,
      membershipId: membershipId || 'custom',
      membershipName,
      amount: Number(amount),
      paymentMethod,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      status: status || 'Completed',
      transactionId: `TXN-${uuidv4().substring(0, 8).toUpperCase()}`
    };

    db.payments.push(newPayment);
    await writeDB(db);

    return res.status(201).json({ message: 'Payment recorded successfully!', payment: newPayment });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record payment.' });
  }
});

// PUT /api/payments/:id (Admin)
router.put('/:id', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.payments.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    db.payments[index] = {
      ...db.payments[index],
      ...req.body
    };

    await writeDB(db);
    return res.json({ message: 'Payment updated successfully!', payment: db.payments[index] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update payment.' });
  }
});

// DELETE /api/payments/:id (Admin)
router.delete('/:id', verifyToken, requireRole('Admin'), async (req: AuthRequest, res: Response) => {
  try {
    const db = await readDB();
    const index = db.payments.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    db.payments.splice(index, 1);
    await writeDB(db);
    return res.json({ message: 'Payment deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete payment.' });
  }
});

export default router;
