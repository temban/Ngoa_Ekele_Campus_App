import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs'; // Import fs module

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if the NewsFeedImages directory exists, if not, create it
const newsFeedImagesDir = path.join(__dirname, '..', 'documents', 'NewsFeedImages');

if (!fs.existsSync(newsFeedImagesDir)) {
  fs.mkdirSync(newsFeedImagesDir);
}

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsFeedImagesDir); // Use NewsFeedImages directory for file storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  }
});
const upload = multer({ storage });

// CREATE: Add a new news feed entry
router.post('/create_newsfeed', upload.array('images', 4), async (req, res) => {
  const { NoteTitle, Content } = req.body;
  const images = req.files.map(file => file.filename); // Get filenames of uploaded images

  try {
    const newFeed = await pool.query(
      `INSERT INTO NewsFeed (NoteTitle, Content, Image1, Image2, Image3, Image4) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [NoteTitle, Content, images[0], images[1], images[2], images[3]]
    );
    res.status(201).json(newFeed.rows[0]); // Return the newly created news feed
  } catch (error) {
    console.error('Error creating news feed:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ: Get all news feed entries
router.get('/get_all_newsfeed', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM NewsFeed');
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No news feeds found' });
      }
  
      const baseUrl = `${req.protocol}://${req.get('host')}/documents/NewsFeedImages`;
  
      // Construct full URLs for the images for each news feed
      const newsFeeds = result.rows.map(feed => ({
        newsfeedid: feed.newsfeedid,
        notetitle: feed.notetitle,
        content: feed.content,
        imageUrl1: feed.image1 ? `${baseUrl}/${feed.image1}` : null,
        imageUrl2: feed.image2 ? `${baseUrl}/${feed.image2}` : null,
        imageUrl3: feed.image3 ? `${baseUrl}/${feed.image3}` : null,
        imageUrl4: feed.image4 ? `${baseUrl}/${feed.image4}` : null,
        createdat: feed.createdat,
      }));
  
      res.status(200).json(newsFeeds); // Return all news feeds with image URLs
    } catch (error) {
      console.error('Error retrieving news feeds:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Route to get a specific news feed by ID with full image URLs
router.get('/newsfeed/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM NewsFeed WHERE NewsFeedID = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'News feed not found' });
      }
  
      const feed = result.rows[0];
      const baseUrl = `${req.protocol}://${req.get('host')}/documents/NewsFeedImages`;
  
      // Construct full URLs for the images
      const newsFeed = {
        newsfeedid: feed.newsfeedid,
        notetitle: feed.notetitle,
        content: feed.content,
        imageUrl1: feed.image1 ? `${baseUrl}/${feed.image1}` : null, 
        imageUrl2: feed.image2 ? `${baseUrl}/${feed.image2}` : null,
        imageUrl3: feed.image3 ? `${baseUrl}/${feed.image3}` : null,
        imageUrl4: feed.image4 ? `${baseUrl}/${feed.image4}` : null,
        createdat: feed.createdat,
      };
  
      res.status(200).json(newsFeed); // Return the specific news feed with image URLs
    } catch (error) {
      console.error('Error retrieving news feed:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  

// UPDATE: Update a specific news feed entry by ID
router.put('/update_newsfeed/:id', upload.array('images', 4), async (req, res) => {
  const { id } = req.params;
  const { NoteTitle, Content } = req.body;
  const images = req.files.map(file => file.filename); // Get filenames of uploaded images

  // Start building the update query
  let query = 'UPDATE NewsFeed SET ';
  const values = [];
  let setFields = [];

  // Only add fields to update if they are provided
  if (NoteTitle) {
    setFields.push(`NoteTitle = $${values.length + 1}`);
    values.push(NoteTitle);
  }

  if (Content) {
    setFields.push(`Content = $${values.length + 1}`);
    values.push(Content);
  }

  // Handle image updates
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        setFields.push(`Image${i + 1} = $${values.length + 1}`);
        values.push(images[i]);
      }
    }
  }

  if (setFields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  query += setFields.join(', ');
  query += ' WHERE NewsFeedID = $' + (values.length + 1);
  values.push(id); // Add the id for the WHERE clause

  try {
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'News feed not found for update' });
    }

    res.status(200).json({ message: 'News feed updated successfully' }); // Return success message
  } catch (error) {
    console.error('Error updating news feed:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a specific news feed entry by ID
router.delete('/newsfeed/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM NewsFeed WHERE NewsFeedID = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'News feed not found for deletion' });
    }

    res.status(200).json({ message: 'News feed deleted successfully' }); // Confirm deletion
  } catch (error) {
    console.error('Error deleting news feed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
