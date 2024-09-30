import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import pool from '../db.js';  // Import your database connection
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import moment from 'moment-timezone'; // Make sure you import moment-timezone

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup directories
const tempDir = path.join(__dirname, '..', 'documents', 'temp');
const pdfUploadsDir = path.join(__dirname, '..', 'documents', 'ResultPDF');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Check if the uploads directory exists for PDFs, if not, create it
if (!fs.existsSync(pdfUploadsDir)) {
    fs.mkdirSync(pdfUploadsDir);
}

// Setup temporary storage for uploaded files
const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir); // Use the temp directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    }
});
const tempUpload = multer({ storage: tempStorage });

// Setup final storage using diskStorage for PDFs
const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pdfUploadsDir); // Use pdfUploadsDir for file storage
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    }
});
const pdfUpload = multer({ storage: pdfStorage });
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files
const router = express.Router();

// Route to upload result PDF and insert other result data into the database
router.post('/upload_temp_result_pdf', tempUpload.single('resultPDF'), async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Define the final file path in the ResultPDF directory
    const finalFilePath = path.join(pdfUploadsDir, req.file.filename);

    // Move the file from temp to final destination
    fs.rename(req.file.path, finalFilePath, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error moving file' });
        }

        // Extract additional fields from the request body
        const {
            StudentName,
            StudentMatr,
            Score,
            CourseID,
            ExamTypeID,
            ResultDate,
        } = req.body;

        // Validate the score, converting empty strings to null
        const score = Score && !isNaN(Score) ? parseFloat(Score) : null;

        // Validate and convert the result date to UTC
        const utcResultDate = moment.tz(ResultDate, 'Africa/Douala').utc().format();

        // Fetch the exam type from the database based on ExamTypeID
        try {
            const examTypeResult = await pool.query(
                `SELECT TypeName FROM ExamType WHERE ExamTypeID = $1`,
                [ExamTypeID]
            );

            // If no exam type is found, return an error
            if (examTypeResult.rows.length === 0) {
                return res.status(404).json({ error: 'Exam type not found' });
            }

            const examType = examTypeResult.rows[0].typename;

            // Set the total based on the exam type
            let total;
            if (examType === 'CC') {
                total = 30; // Continuous Assessment total
            } else if (examType === 'SN') {
                total = 70; // Session Normale total
            } else {
                return res.status(400).json({ error: 'Invalid exam type' });
            }

            // Insert the data into the Result table
            const insertQuery = `
                INSERT INTO Result (StudentName, StudentMatr, Score, Total, CourseID, ExamTypeID, PDFResult, ResultDate)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING ResultID
            `;
            const values = [
                StudentName,
                StudentMatr,
                score, // Use the validated score
                total, // Use the calculated total based on ExamType
                CourseID,
                ExamTypeID,
                req.file.filename, // Use the uploaded file name
                utcResultDate // Include the converted ResultDate
            ];

            const result = await pool.query(insertQuery, values);

            // Debug: Log the entire result object to inspect what is returned
            console.log('Insert result:', result);

            // Check if the ResultID exists in the returned rows
            if (result.rows.length === 0 || !result.rows[0].resultid) {
                return res.status(500).json({ error: 'Result ID not returned' });
            }

            res.status(201).json({
                message: 'Result PDF uploaded and data inserted successfully',
                resultID: result.rows[0].resultid, // Return the newly created Result ID (ensure it's lowercase)
                pdfPath: req.file.filename // Return the path of the uploaded PDF
            });
        } catch (dbError) {
            console.error('Error inserting data into Result table:', dbError);
            res.status(500).json({ error: 'Error inserting data into Result table' });
        }
    });
});


router.put('/update_result_pdf/:id', tempUpload.single('resultPDF'), async (req, res) => {
    const { id } = req.params; // Extract the ResultID from the request parameters

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Define the final file path in the ResultPDF directory
    const finalFilePath = path.join(pdfUploadsDir, req.file.filename);

    // Move the file from temp to final destination
    fs.rename(req.file.path, finalFilePath, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error moving file' });
        }

        // Extract ResultDate from the request body
        const { resultDate } = req.body;

        try {
            // Check if the record exists and the PDFResult field is not empty
            const existingResult = await pool.query(
                'SELECT PDFResult FROM Result WHERE ResultID = $1',
                [id]
            );

            if (existingResult.rows.length === 0) {
                return res.status(404).json({ error: 'Result not found' });
            }

            const currentPdfFile = existingResult.rows[0].pdfresult;

            if (!currentPdfFile) {
                return res.status(400).json({ error: 'Current PDF field is empty, cannot update' });
            }

            // Update the PDFResult and ResultDate fields in the Result table
            const updateQuery = `
                UPDATE Result 
                SET PDFResult = $1, ResultDate = $2 
                WHERE ResultID = $3
            `;
            const values = [req.file.filename, resultDate, id];

            await pool.query(updateQuery, values);

            res.status(200).json({
                message: 'PDF and Result Date updated successfully',
                pdfPath: req.file.filename, // Return the path of the updated PDF
                updatedResultDate: resultDate // Return the updated Result Date
            });
        } catch (error) {
            console.error('Error updating PDF result:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// Route to retrieve a result PDF
router.get('/result_pdf/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Retrieve the PDF path from the Result table
        const result = await pool.query('SELECT PDFResult FROM Result WHERE ResultID = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }

        const pdfFile = result.rows[0].pdfresult;

        if (!pdfFile) {
            return res.status(404).json({ message: 'PDF result not found' });
        }

        // Send the PDF result URL
        const pdfUrl = `${req.protocol}://${req.get('host')}/documents/ResultPDF/${pdfFile}`;
        res.json({ pdfUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/result_pdfs/:date', async (req, res) => {
    const { date } = req.params;

    try {
        // Retrieve all relevant fields from the Result table for the specified date
        const result = await pool.query(
            `SELECT ResultID, StudentName, StudentMatr, Score, Total, CourseID, ExamTypeID, PDFResult, ResultDate 
             FROM Result 
             WHERE ResultDate::date = $1 AND PDFResult IS NOT NULL AND PDFResult != ''`,
            [date]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No results found for this date' });
        }

        // Map through results to create an array of objects with relevant data
        const pdfLinks = result.rows.map(row => {
            return {
                resultID: row.resultid,
                studentName: row.studentname,
                studentMatr: row.studentmatr,
                score: row.score,
                total: row.total,
                courseID: row.courseid,
                examTypeID: row.examtypeid,
                pdfUrl: `${req.protocol}://${req.get('host')}/documents/ResultPDF/${row.pdfresult}`,
                resultDate: row.resultdate
            };
        });

        // Send the array of PDF objects
        res.json({ pdfLinks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to upload an Excel sheet and save results
router.post('/excel_upload_results/courseid/:courseid/examtypeid/:examtypeid', upload.single('file'), async (req, res) => {
    const { courseid, examtypeid } = req.params;
    const { resultdate } = req.body; // Extract ResultDate from the form data

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const data = xlsx.utils.sheet_to_json(sheet);
        const results = [];
        let uploadedCount = 0;

        // Convert resultdate to UTC for storage
        const utcResultDate = moment.tz(resultdate, 'Africa/Douala').utc().format();

        for (const row of data) {
            const { Names, Matr, Marks } = row; // Ensure these match your column names in the Excel file

            // Check if the record already exists, accounting for null values
            const existingResult = await pool.query(
                `SELECT * FROM Result WHERE StudentName = $1 
                 AND (StudentMatr = $2 OR (StudentMatr IS NULL AND $2 IS NULL)) 
                 AND CourseID = $3 
                 AND ExamTypeID = $4`,
                [Names, Matr, courseid, examtypeid]
            );

            // Skip if the record already exists
            if (existingResult.rows.length > 0) {
                continue; // Skip this iteration if the record exists
            }

            // Prepare the data for insertion
            const resultData = {
                studentname: Names,
                studentmatr: Matr,
                score: Marks,
                resultdate: utcResultDate // Use the converted ResultDate
            };

            // Fetch the exam type from the database based on examtypeid
            const examTypeResult = await pool.query(
                `SELECT TypeName FROM ExamType WHERE ExamTypeID = $1`,
                [examtypeid]
            );

            // If no exam type is found, return an error
            if (examTypeResult.rows.length === 0) {
                return res.status(404).json({ error: 'Exam type not found' });
            }

            const examType = examTypeResult.rows[0].typename;

            // Set the total based on the exam type
            let total;
            if (examType === 'CC') {
                total = 30; // Continuous Assessment total
            } else if (examType === 'SN') {
                total = 70; // Session Normale total
            } else {
                return res.status(400).json({ error: 'Invalid exam type' });
            }

            // Insert the new result into the database, including ResultDate
            const newResult = await pool.query(
                `INSERT INTO Result (StudentName, StudentMatr, Score, Total, CourseID, ExamTypeID, ResultDate)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [resultData.studentname, resultData.studentmatr, resultData.score, total, courseid, examtypeid, resultData.resultdate]
            );

            results.push(newResult.rows[0]);
            uploadedCount++; // Increment the count of successfully uploaded results
        }

        res.status(201).json({
            message: 'Results uploaded successfully',
            uploadedCount,
            results
        });
    } catch (error) {
        console.error('Error uploading results:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a result (with ExamTypeID and CourseID passed through the endpoint)
router.post('/create_result/courseid/:courseid/examtypeid/:examtypeid', async (req, res) => {
    const { studentname, studentmatr, score, resultdate } = req.body; // Include ResultDate from request body
    const { courseid, examtypeid } = req.params;

    try {
        // Convert resultdate to UTC for storage
        const utcResultDate = moment.tz(resultdate, 'Africa/Douala').utc().format();

        // Fetch the exam type from the database based on examtypeid
        const examTypeResult = await pool.query(
            `SELECT TypeName FROM ExamType WHERE ExamTypeID = $1`,
            [examtypeid]
        );

        // If no exam type is found, return an error
        if (examTypeResult.rows.length === 0) {
            return res.status(404).json({ error: 'Exam type not found' });
        }

        const examType = examTypeResult.rows[0].typename;

        // Set the total based on the exam type
        let total;
        if (examType === 'CC') {
            total = 30; // Continuous Assessment total
        } else if (examType === 'SN') {
            total = 70; // Session Normale total
        } else {
            return res.status(400).json({ error: 'Invalid exam type' });
        }

        // Insert the new result into the database
        const newResult = await pool.query(
            `INSERT INTO Result (StudentName, StudentMatr, Score, Total, CourseID, ExamTypeID, ResultDate)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [studentname, studentmatr, score, total, courseid, examtypeid, utcResultDate] // Include converted ResultDate
        );

        res.status(201).json({
            message: 'Result created successfully',
            result: newResult.rows[0]
        });
    } catch (error) {
        console.error('Error creating result:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a result by ID (with ExamTypeID and CourseID passed through the endpoint)
router.put('/update_result/resultid/:id/courseid/:courseid/examtypeid/:examtypeid', async (req, res) => {
    const { id, courseid, examtypeid } = req.params;
    const { studentname, studentmatr, score, resultdate } = req.body; // Include ResultDate from request body

    try {
        // Fetch the current result to preserve the total value
        const result = await pool.query(
            `SELECT Total FROM Result WHERE ResultID = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Preserve the current 'total' value
        const total = result.rows[0].total;

        // Update the result without changing 'total'
        const updatedResult = await pool.query(
            `UPDATE Result
             SET StudentName = $1, StudentMatr = $2, Score = $3, CourseID = $4, ExamTypeID = $5, ResultDate = $6
             WHERE ResultID = $7 RETURNING *`,
            [studentname, studentmatr, score, courseid, examtypeid, resultdate, id] // Include ResultDate
        );

        res.json({
            message: 'Result updated successfully',
            result: updatedResult.rows[0]
        });
    } catch (error) {
        console.error('Error updating result:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all results
router.get('/get_results', async (req, res) => {
    try {
        const results = await pool.query(
            `SELECT r.*, c.CourseName AS course_name, et.TypeName AS exam_type
             FROM Result r
             JOIN Course c ON r.CourseID = c.CourseID
             JOIN ExamType et ON r.ExamTypeID = et.ExamTypeID`
        );

        res.json(results.rows);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a specific result by ID
router.get('/get_result/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.*, c.CourseName AS course_name, et.TypeName AS exam_type
             FROM Result r
             JOIN Course c ON r.CourseID = c.CourseID
             JOIN ExamType et ON r.ExamTypeID = et.ExamTypeID
             WHERE r.ResultID = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching result by ID:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a result by ID
router.delete('/delete_result/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await pool.query(
            `DELETE FROM Result WHERE ResultID = $1 RETURNING *`,
            [id]
        );

        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }

        res.json({
            message: 'Result deleted successfully',
            result: deleteResult.rows[0]
        });
    } catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).json({ error: error.message });
    }
});


// Route to delete all results
router.delete('/delete_all_results', async (req, res) => {
    try {
        // Delete all entries in the Result table
        const result = await pool.query('DELETE FROM Result');
        
        // Send response
        res.status(200).json({
            message: 'All results deleted successfully',
            deletedCount: result.rowCount // Count of deleted rows
        });
    } catch (error) {
        console.error('Error deleting results:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to search for students by a substring in their names (case-insensitive)
router.get('/search/name/:namePart', async (req, res) => {
    const { namePart } = req.params;

    try {
        // Query to find students whose names contain the provided substring (case-insensitive)
        const result = await pool.query(
            'SELECT * FROM Result WHERE StudentName ILIKE $1',
            [`%${namePart}%`]  // Using ILIKE for case-insensitive search with wildcards
        );

        // Check if any results were found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No students found with that name part' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error searching by name part:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to search for a student by matricule (case-insensitive)
router.get('/search/matricule/:matricule', async (req, res) => {
    const { matricule } = req.params;

    try {
        // Query to find students matching the matricule (case-insensitive)
        const result = await pool.query(
            'SELECT * FROM Result WHERE StudentMatr ILIKE $1',
            [`%${matricule}%`]  // Using ILIKE for case-insensitive search with wildcards
        );

        // Check if any results were found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No student found with that matricule' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error searching by matricule:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;