// backend/src/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRoutes    = require('./routes/authRoutes');
const journeyRoutes = require('./routes/journey');

app.use('/api/auth',    authRoutes);
app.use('/api/journey', journeyRoutes);


// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
