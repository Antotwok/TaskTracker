const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET ALL TASKS
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const values = [];

    if (status === 'Done') {
      query += ' AND is_done = true';
    }

    if (status === 'Pending') {
      query += ' AND is_done = false';
    }

    if (priority) {
      values.push(priority);
      query += ` AND priority = $${values.length}`;
    }

    query += ' ORDER BY due_date ASC NULLS LAST';

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET SINGLE TASK
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// CREATE TASK
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      due_date,
      priority = 'Medium',
      is_done = false
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO tasks
      (title, description, due_date, priority, is_done)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        title.trim(),
        description || null,
        due_date || null,
        priority,
        is_done
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// UPDATE TASK
router.put('/:id', async (req, res) => {
  try {

    const {
      title,
      description,
      due_date,
      priority,
      is_done = false
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = $1,
        description = $2,
        due_date = $3,
        priority = $4,
        is_done = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        title.trim(),
        description || null,
        due_date || null,
        priority,
        is_done,
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE TASK
router.delete('/:id', async (req, res) => {
  try {

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json({
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
