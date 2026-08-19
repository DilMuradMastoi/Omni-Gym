import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/auth.js';
import memberRoutes from './server/routes/members.js';
import membershipRoutes from './server/routes/memberships.js';
import trainerRoutes from './server/routes/trainers.js';
import attendanceRoutes from './server/routes/attendance.js';
import paymentRoutes from './server/routes/payments.js';
import workoutRoutes from './server/routes/workouts.js';
import dashboardRoutes from './server/routes/dashboard.js';
import reportRoutes from './server/routes/reports.js';
import aiRoutes from './server/routes/ai.js';
import { readDB } from './server/db.js';

// Setup uploads directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // File Upload API
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ message: 'File uploaded successfully!', url: fileUrl });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/members', memberRoutes);
  app.use('/api/memberships', membershipRoutes);
  app.use('/api/trainers', trainerRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/workouts', workoutRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/ai', aiRoutes);

  // Healthcheck API
  app.get('/api/health', async (_req, res) => {
    const db = await readDB();
    return res.json({
      status: 'ok',
      membersCount: db.users.filter(u => u.role === 'Member').length,
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Pre-initialize DB seed
  await readDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Gym Management Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
