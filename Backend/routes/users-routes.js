import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs'; // Import fs module

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if the uploads directory exists, if not, create it
const uploadsDir = path.join(__dirname, '..', 'documents', 'ProfileImages');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use uploadsDir for file storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  }
});
const upload = multer({ storage });

// Route to store profile picture
router.post('/upload_profile_picture/:id', upload.single('profilePicture'), async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await pool.query('SELECT profileimage FROM users WHERE userid = $1', [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileImagePath = req.file.filename; // Get the filename of the uploaded image

    // Update the user's profile image in the database
    await pool.query('UPDATE users SET profileimage = $1 WHERE userid = $2', [profileImagePath, id]);

    res.json({ message: 'Profile picture uploaded successfully', profileImagePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update profile picture
router.put('/update_profile_picture/:id', upload.single('profilePicture'), async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await pool.query('SELECT profileimage FROM users WHERE userid = $1', [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileImagePath = req.file.filename;

    // Update the user's profile image in the database
    await pool.query('UPDATE users SET profileimage = $1 WHERE userid = $2', [profileImagePath, id]);

    res.json({ message: 'Profile picture updated successfully', profileImagePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete profile picture
router.delete('/delete_profile_picture/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Set profileimage to null in the database
    await pool.query('UPDATE users SET profileimage = NULL WHERE userid = $1', [id]);

    res.json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to display profile picture
router.get('/profile_picture/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the user's profile image path from the database
    const user = await pool.query('SELECT profileimage FROM users WHERE userid = $1', [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileImage = user.rows[0].profileimage;

    if (!profileImage) {
      return res.status(404).json({ error: 'Profile image not found' });
    }

    // Send the profile image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/documents/ProfileImages/${profileImage}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 

// GET users listing
router.get('/get_users', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await pool.query(
      `SELECT 
        userid, 
        name, 
        email, 
        phone, 
        country, 
        town, 
        street, 
        role, 
        subscriptionstatus, 
        level, 
        departmentid, 
        isactive,
        registrationdate 
      FROM users 
      WHERE userid = $1`,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to edit a user by ID
router.put('/edit_user/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    email, 
    password, 
    phone, 
    country, 
    town, 
    street, 
    role, 
    subscriptionstatus, 
    level, 
    isactive,
    departmentid 
  } = req.body;

  try {
    let hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const updatedUser = await pool.query(
      `UPDATE users 
        SET 
          name = COALESCE($1, name), 
          email = COALESCE($2, email), 
          password = COALESCE($3, password), 
          phone = COALESCE($4, phone), 
          country = COALESCE($5, country), 
          town = COALESCE($6, town), 
          street = COALESCE($7, street), 
          role = COALESCE($8, role), 
          subscriptionstatus = COALESCE($9, subscriptionstatus), 
          level = COALESCE($10, level), 
          isactive = COALESCE($11, isactive),  -- Updated index for isactive
          departmentid = COALESCE($12, departmentid) 
      WHERE userid = $13 
      RETURNING *`,
      [
        name,            // $1
        email,           // $2
        hashedPassword,  // $3
        phone,           // $4
        country,         // $5
        town,            // $6
        street,          // $7
        role,            // $8
        subscriptionstatus, // $9
        level,           // $10
        isactive,        // $11
        departmentid,    // $12
        id               // $13
      ]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: updatedUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to change user password
router.put('/edit_password/:id', async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Get the user from the database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE userid = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatedUser = await pool.query(
      'UPDATE users SET password = $1 WHERE userid = $2 RETURNING *',
      [hashedNewPassword, id]
    );

    res.json({ message: 'Password updated successfully', user: updatedUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT to change subscription status to active
router.put('/change_subscription/:id', async (req, res) => {
  const { id } = req.params;
  const { subscriptionStatus } = req.body; // Get the desired subscription status from the request body

  // Validate the provided status
  if (!['Active', 'Inactive'].includes(subscriptionStatus)) {
    return res.status(400).json({ error: 'Invalid subscription status. It must be either Active or Inactive.' });
  }

  try {
    // Update the subscription status based on the provided value
    const updatedUser = await pool.query(
      'UPDATE users SET subscriptionstatus = $1 WHERE userid = $2 RETURNING *',
      [subscriptionStatus, id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Subscription status updated successfully', user: updatedUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Search users by department ID
router.get('/users/department/:departmentid', async (req, res) => {
  const { departmentid } = req.params;

  try {
      const usersByDepartment = await pool.query(
          `SELECT d.DepartmentName, u.UserID, u.Name, u.Email, u.Phone, u.Country, u.Town, u.Street, u.Role, u.SubscriptionStatus, u.Level, u.RegistrationDate, u.IsActive, u.ProfileImage
           FROM Users u
           JOIN Department d ON u.DepartmentID = d.DepartmentID
           WHERE u.DepartmentID = $1`,
          [departmentid]
      );

      if (usersByDepartment.rows.length === 0) {
          return res.status(404).json({ message: 'No users found for this department.' });
      }

      res.json({
          department_name: usersByDepartment.rows[0].departmentname,
          users: usersByDepartment.rows.map(user => ({
              userid: user.userid,
              name: user.name,
              email: user.email,
              phone: user.phone,
              country: user.country,
              town: user.town,
              street: user.street,
              role: user.role,
              subscriptionstatus: user.subscriptionstatus,
              level: user.level,
              registrationdate: user.registrationdate,
              isactive: user.isactive,
              profileimage: user.profileimage
          }))
      });
  } catch (error) {
      console.error('Error fetching users by department:', error);
      res.status(500).json({ error: error.message });
  }
});


// Search users by level
router.get('/users/level/:level', async (req, res) => {
  const { level } = req.params;

  try {
      const usersByLevel = await pool.query(
          `SELECT u.UserID, u.Name, u.Email, u.Phone, u.Country, u.Town, u.Street, u.Role, u.SubscriptionStatus, u.Level, u.RegistrationDate, u.IsActive, u.ProfileImage
           FROM Users u
           WHERE u.Level = $1`,
          [level]
      );

      if (usersByLevel.rows.length === 0) {
          return res.status(404).json({ message: 'No users found for this level.' });
      }

      res.json({
          level: usersByLevel.rows[0].level,
          users: usersByLevel.rows.map(user => ({
              userid: user.userid,
              name: user.name,
              email: user.email,
              phone: user.phone,
              country: user.country,
              town: user.town,
              street: user.street,
              role: user.role,
              subscriptionstatus: user.subscriptionstatus,
              registrationdate: user.registrationdate,
              isactive: user.isactive,
              profileimage: user.profileimage
          }))
      });
  } catch (error) {
      console.error('Error fetching users by level:', error);
      res.status(500).json({ error: error.message });
  }
});

// Export the router
export default router;
