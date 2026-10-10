// backend/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────────────
const authRoutes     = require('./routes/authRoutes');
const journeyRoutes  = require('./routes/journey');
const stationRoutes  = require('./routes/stationRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const reportRoutes   = require('./routes/reportRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const exploreRoutes  = require('./routes/exploreRoutes');

app.use('/api/auth',      authRoutes);
app.use('/api/journey',   journeyRoutes);
app.use('/api/stations',  stationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reports',   reportRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/explore',   exploreRoutes);

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Global error handler - always returns JSON with error details
app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(err.details && { details: err.details }),
  });
});

// Process-level safety nets — prevent unhandled rejections / exceptions from
// crashing the server (e.g. Prisma connection pool errors when PostgreSQL is
// offline).  Without these handlers Node.js may terminate the process.
process.on('unhandledRejection', (reason, promise) => {
  console.warn('[server] Unhandled Promise rejection:', reason?.message || reason);
});

process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err);
});

app.listen(port, () => {
  console.log(`✅ TRANSIT backend listening on port ${port}`);
});
