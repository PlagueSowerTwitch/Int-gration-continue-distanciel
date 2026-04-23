require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/todos', todosRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await connectDB();
    console.log('✅ PostgreSQL connecté');
    app.listen(PORT, () => {
      console.log(`🚀 Backend démarré sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur de démarrage:', err);
    process.exit(1);
  }
}

start();

module.exports = app; // Export pour les tests
