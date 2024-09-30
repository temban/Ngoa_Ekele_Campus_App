import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../db.js'; // Adjust the path as needed

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup storage for PDF files
const pdfUploadsDir = path.join(__dirname,'..', 'documents', 'CourseNotes');
 
// Check if the uploads directory exists, if not, create it
if (!fs.existsSync(pdfUploadsDir)) {
  fs.mkdirSync(pdfUploadsDir);
}

// Setup multer for PDF uploads
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfUploadsDir); // Use pdfUploadsDir for file storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  }
});
const upload = multer({ storage: pdfStorage });

const router = express.Router();
 
// Route to create a new course note with PDF upload
router.post('/cerate_course_notes', upload.single('pdf'), async (req, res) => {
  const { courseId, title } = req.body;
  const pdfPath = req.file ? req.file.filename : null;

  try {
    if (!pdfPath) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const result = await pool.query(
      'INSERT INTO CourseNotes (CourseID, Title, PDFPath) VALUES ($1, $2, $3) RETURNING *',
      [courseId, title, pdfPath]
    );

    res.status(201).json(result.rows[0]); // Return the created course note
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all course notes
router.get('/get_all_course_notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM CourseNotes');

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No course notes found' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/documents/CourseNotes`;
    const courseNotes = result.rows.map(note => ({
      noteid: note.noteid,
      courseid: note.courseid,
      title: note.title,
      pdfUrl: `${baseUrl}/${note.pdfpath}`,
    }));

    res.status(200).json(courseNotes); // Return all course notes with PDF URLs
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a specific course note by ID
router.get('/course_note/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM CourseNotes WHERE NoteID = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course note not found' });
    }

    const note = result.rows[0];
    const baseUrl = `${req.protocol}://${req.get('host')}/documents/CourseNotes`;
    const courseNote = {
      noteid: note.noteid,
      courseid: note.courseid,
      title: note.title,
      pdfUrl: `${baseUrl}/${note.pdfpath}`,
    };

    res.status(200).json(courseNote); // Return the specific course note
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a course note by ID
router.put('/update_course_notes/:id', upload.single('pdf'), async (req, res) => {
  const { id } = req.params;
  const { courseId, title } = req.body;
  const pdfPath = req.file ? req.file.filename : null;

  try {
    const query = 'UPDATE CourseNotes SET CourseID = $1, Title = $2' + (pdfPath ? ', PDFPath = $3' : '') + ' WHERE NoteID = $4 RETURNING *';
    const values = pdfPath ? [courseId, title, pdfPath, id] : [courseId, title, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course note not found' });
    }

    res.status(200).json(result.rows[0]); // Return the updated course note
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a course note by ID
router.delete('/delete_course_notes/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM CourseNotes WHERE NoteID = $1 RETURNING *', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Course note not found' });
      }
  
      // Respond with the deleted note details
      const deletedNote = result.rows[0];
      res.status(200).json({
        message: 'Course note deleted successfully',
        deletedNote: {
          NoteID: deletedNote.notedid,
          Title: deletedNote.title,
          PDFPath: deletedNote.pdfpath,
          CourseID: deletedNote.courseid
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

export default router;
