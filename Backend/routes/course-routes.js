// Import dependencies
import express from 'express';
import pool from '../db.js';  // Adjust the path to your db.js file

// Create a new express router
const router = express.Router();

// CREATE a new Course
router.post('/create_course', async (req, res) => {
    const { CourseCode, CourseName, Level, DepartmentID } = req.body;

    try {
        const newCourse = await pool.query(
            'INSERT INTO Course (CourseCode, CourseName, Level, DepartmentID) VALUES ($1, $2, $3, $4) RETURNING *',
            [CourseCode, CourseName, Level, DepartmentID]
        );
        res.status(201).json(newCourse.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ/Get all Courses
router.get('/get_courses', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM Course');
        res.json(courses.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ/Get a single Course by ID
router.get('/courses/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const course = await pool.query('SELECT * FROM Course WHERE CourseID = $1', [id]);

        if (course.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE a Course by ID
router.put('/update_course/:id', async (req, res) => {
    const { id } = req.params;
    const { CourseCode, CourseName, Level, DepartmentID } = req.body;

    try {
        const updatedCourse = await pool.query(
            'UPDATE Course SET CourseCode = $1, CourseName = $2, Level = $3, DepartmentID = $4 WHERE CourseID = $5 RETURNING *',
            [CourseCode, CourseName, Level, DepartmentID, id]
        );

        if (updatedCourse.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(updatedCourse.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a Course by ID
router.delete('/delete_course/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCourse = await pool.query('DELETE FROM Course WHERE CourseID = $1 RETURNING *', [id]);

        if (deletedCourse.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course deleted', course: deletedCourse.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all courses, with optional filtering by Level or DepartmentID
router.get('/search_courses/level_or_department', async (req, res) => {
    const { level, departmentid } = req.query;

    try {
        let query = 'SELECT * FROM Course WHERE 1=1'; // Basic query
        const params = [];

        // Add filtering conditions based on query parameters
        if (level) {
            query += ' AND Level = $' + (params.length + 1);
            params.push(level);
        }
        if (departmentid) {
            query += ' AND DepartmentID = $' + (params.length + 1);
            params.push(departmentid);
        }

        const courses = await pool.query(query, params);
        res.json(courses.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/create_exam_type', async (req, res) => {
    const { TypeName } = req.body;

    try {
        // Insert into the ExamType table
        const newExamType = await pool.query(
            'INSERT INTO ExamType (TypeName) VALUES ($1) RETURNING *',
            [TypeName]
        );

        res.status(201).json(newExamType.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/examtypes', async (req, res) => {
    try {
        // Fetch all exam types from the database
        const result = await pool.query('SELECT * FROM ExamType');

        // Check if there are any exam types
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No exam types found' });
        }

        // Send the result as a JSON response
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving exam types:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get an exam type by ID
router.get('/examtype/:id', async (req, res) => {
    const { id } = req.params; // Extract the id from the route parameter

    try {
        // Fetch exam type by ID from the database
        const result = await pool.query('SELECT * FROM ExamType WHERE ExamTypeID = $1', [id]);

        // Check if the exam type exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Exam type with ID ${id} not found` });
        }

        // Send the result as a JSON response
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving exam type:', error);
        res.status(500).json({ error: error.message });
    }
});
// Export the router
export default router;
