import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from '../db.js'; // Adjust the path as needed
import { jwtTokens } from '../utils/jwt-helpers.js'; // Adjust the path as needed

const router = express.Router();
const client = new OAuth2Client('70912245721-40neqr6u551m5eg1vreiml0v2sog9cc5.apps.googleusercontent.com');

// Google Sign-In and account creation endpoint
router.post('/google_auth', async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: 'ID Token is required' });
        }

        // Verify the ID token with Google
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: '70912245721-40neqr6u551m5eg1vreiml0v2sog9cc5.apps.googleusercontent.com',
        });

        // Extract the payload from the token
        const payload = ticket.getPayload();

        // Log the entire payload object
        console.log("Google Account Payload:", payload);

        const userEmail = payload.email;
        const userName = payload.name;
        const userPhone = payload.phone_number || ''; // Google might not provide this
        const userPicture = payload.picture || ''; // Optional: Get user's Google profile picture URL
        const userCountry = ''; // Assuming you want to leave this empty for new users
        const userTown = ''; // Assuming you want to leave this empty for new users
        const userStreet = ''; // Assuming you want to leave this empty for new users
        const userRole = 'Student'; // Default role for new users
        const userSubscriptionStatus = 'Inactive'; // Default subscription status for new users
        const userLevel = null; // Default level for new users
        const userDepartmentID = null; // Default department ID for new users
        const userRegistrationDate = new Date(); // Registration date

        // Check if the user exists in the database
        const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [userEmail]);

        let user;
        if (users.rows.length === 0) {
            // If the user does not exist, create a new user
            const newUser = await pool.query(
                `INSERT INTO users (
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
                    registrationdate
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                [
                    userName,             // Name
                    userEmail,            // Email
                    userPhone,            // Phone
                    userCountry,          // Country
                    userTown,             // Town
                    userStreet,           // Street
                    userRole,             // Role
                    userSubscriptionStatus,// Subscription Status
                    userLevel,            // Level
                    userDepartmentID,     // Department ID
                    userRegistrationDate   // Registration Date
                ]
            );
            user = newUser.rows[0];
        } else {
            // User exists, retrieve user data
            user = users.rows[0];
        }

        // Generate JWT tokens
        const tokens = jwtTokens({
            UserID: user.userid,
            Name: user.name,
            Email: user.email,
            Phone: user.phone,
            Country: userCountry,
            Town: userTown,
            Street: userStreet,
            Role: user.role,
            SubscriptionStatus: user.subscriptionstatus,
            Level: user.level,
            DepartmentID: user.departmentid,
            RegistrationDate: user.registrationdate,
            IsActive: user.isactive // Assuming isactive is part of your user object
        });

        // Set refresh token in cookies
        res.cookie('refresh_token', tokens.refreshToken, {
            ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        // Return the JWT tokens and user info
        return res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                UserID: user.userid,
                Name: user.name,
                Email: user.email,
                Phone: user.phone,
                Country: userCountry,
                Town: userTown,
                Street: userStreet,
                Role: user.role,
                SubscriptionStatus: user.subscriptionstatus,
                Level: user.level,
                DepartmentID: user.departmentid,
                RegistrationDate: user.registrationdate,
                IsActive: user.isactive // Assuming isactive is part of your user object
            },
            payload // Include the entire payload object in the response
        });

    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
});


export default router;
