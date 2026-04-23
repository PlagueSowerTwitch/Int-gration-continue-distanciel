const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Toutes les routes todos nécessitent une authentification
router.use(authMiddleware);

// GET /api/todos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/todos
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Le titre est requis' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
      [req.userId, title.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/todos/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      `UPDATE todos 
       SET title = COALESCE($1, title), completed = COALESCE($2, completed)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, completed, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo non trouvé' });
    }
    res.json({ message: 'Todo supprimé', id: parseInt(id) });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
