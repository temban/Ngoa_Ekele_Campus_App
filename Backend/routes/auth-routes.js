import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { jwtTokens } from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/sign_up', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const newUser = await pool.query(
      `INSERT INTO users (
          name, 
          email, 
          password, 
          studentmatr,
          phone, 
          country, 
          town, 
          street, 
          role, 
          subscriptionstatus, 
          level, 
          departmentid, 
          registrationdate, 
          isactive  -- Added isactive to the INSERT statement
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)  -- Added $13 for isactive
        RETURNING userid, name, email, studentmatr, phone, country, town, street, role, subscriptionstatus, level, departmentid, registrationdate, isactive`, // Added isactive to RETURNING
      [
        req.body.name,             // $1
        req.body.email,            // $2
        hashedPassword,
        req.body.studentmatr,             // $3
        req.body.phone,            // $4
        req.body.country,          // $5
        req.body.town,             // $6
        req.body.street,           // $7
        req.body.role || 'Student', // $8
        req.body.subscriptionstatus || 'Inactive', // $9
        req.body.level,            // $10
        req.body.departmentid,     // $11
        new Date(),                // $12
        req.body.isactive !== undefined ? req.body.isactive : true // $13, defaulting to true if not provided
      ]
    );

    res.json({ 
      userid: newUser.rows[0].userid, 
      name: newUser.rows[0].name, 
      email: newUser.rows[0].email, 
      studentmatr: newUser.rows[0].studentmatr, 
      phone: newUser.rows[0].phone, 
      country: newUser.rows[0].country, 
      town: newUser.rows[0].town, 
      street: newUser.rows[0].street, 
      role: newUser.rows[0].role, 
      subscriptionstatus: newUser.rows[0].subscriptionstatus, 
      level: newUser.rows[0].level, 
      departmentid: newUser.rows[0].departmentid, 
      registrationdate: newUser.rows[0].registrationdate,
      isactive: newUser.rows[0].isactive // Added isactive to the response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    console.log(req.cookies, req.get('origin'));
    const { email, password } = req.body;

    // Fetch the user from the database
    const users = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
    if (users.rows.length === 0) {
      return res.status(401).json({ error: "Email is incorrect" });
    }

    // Check if the password is valid
    const validPassword = await bcrypt.compare(password, users.rows[0].password); // Make sure to match field names
    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT tokens
    let tokens = jwtTokens(users.rows[0]); // Get access and refresh tokens

    // Set refresh token in cookies
    res.cookie('refresh_token', tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: 'None', // Should be 'None' if you want to send cookies with cross-origin requests
      secure: true // Ensure to use secure cookies when using HTTPS
    });

    // Send tokens back to the client
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message }); // Use 500 for server errors
  }
});


  router.get('/refresh_token', (req, res) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      console.log(req.cookies);
      if (refreshToken === null) return res.sendStatus(401);
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({error:error.message});
        let tokens = jwtTokens(user);
        res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
        return res.json(tokens);
      });
    } catch (error) {
      res.status(401).json({error: error.message});
    }
  });
  
  router.delete('/delete_token', (req, res) => {
    try {
      res.clearCookie('refresh_token');
      res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
      return res.status(200).json({message:'Refresh token deleted.'});
    } catch (error) {
      res.status(401).json({error: error.message});
    }
  });
  


export default router;