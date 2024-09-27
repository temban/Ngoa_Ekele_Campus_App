import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { jwtTokens } from '../utils/jwt-helpers.js';


const router = express.Router();

// Create a new department
router.post('/create_department', async (req, res) => {
  const { departmentName } = req.body;

  if (!departmentName) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  try {
    const newDepartment = await pool.query(
      'INSERT INTO Department (DepartmentName) VALUES ($1) RETURNING *',
      [departmentName]
    );
    res.json({ message: 'Department created successfully', department: newDepartment.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all departments
router.get('/get_departments', async (req, res) => {
  try {
    const departments = await pool.query('SELECT * FROM Department ORDER BY DepartmentID');
    res.json(departments.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a department by ID
router.get('/department/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const department = await pool.query('SELECT * FROM Department WHERE DepartmentID = $1', [id]);

    if (department.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a department by ID
router.put('/update_departments/:id', async (req, res) => {
  const { id } = req.params;
  const { departmentName } = req.body;

  if (!departmentName) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  try {
    const updatedDepartment = await pool.query(
      'UPDATE Department SET DepartmentName = $1 WHERE DepartmentID = $2 RETURNING *',
      [departmentName, id]
    );

    if (updatedDepartment.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department updated successfully', department: updatedDepartment.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a department by ID
router.delete('/delete_department/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDepartment = await pool.query(
      'DELETE FROM Department WHERE DepartmentID = $1 RETURNING *',
      [id]
    );

    if (deletedDepartment.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully', department: deletedDepartment.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
