/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userid:
 *           type: integer
 *           description: Auto-generated ID of the user
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           description: Email address of the user
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *         country:
 *           type: string
 *           description: Country of residence
 *         town:
 *           type: string
 *           description: Town or city
 *         street:
 *           type: string
 *           description: Street address
 *         role:
 *           type: string
 *           description: User role (e.g., Student)
 *         subscriptionstatus:
 *           type: string
 *           description: Subscription status (e.g., Active, Inactive)
 *         level:
 *           type: string
 *           description: Education level or user level
 *         departmentid:
 *           type: integer
 *           description: ID of the department
 *         registrationdate:
 *           type: string
 *           format: date-time
 *           description: Registration date and time
 *         isactive:
 *           type: boolean
 *           description: Whether the user account is active
 *       example:
 *         userid: 1
 *         name: "John Doe"
 *         email: "johndoe@example.com"
 *         phone: "1234567890"
 *         country: "USA"
 *         town: "New York"
 *         street: "123 Main St"
 *         role: "Student"
 *         subscriptionstatus: "Inactive"
 *         level: "Undergraduate"
 *         departmentid: 2
 *         registrationdate: "2023-10-01T12:00:00Z"
 *         isactive: true
 *
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - country
 *         - town
 *         - street
 *         - level
 *         - departmentid
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           description: Email address of the user
 *         password:
 *           type: string
 *           format: password
 *           description: Password for the account
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *         country:
 *           type: string
 *           description: Country of residence
 *         town:
 *           type: string
 *           description: Town or city
 *         street:
 *           type: string
 *           description: Street address
 *         role:
 *           type: string
 *           description: User role (default is 'Student')
 *         subscriptionstatus:
 *           type: string
 *           description: Subscription status (default is 'Inactive')
 *         level:
 *           type: string
 *           description: Education level or user level
 *         departmentid:
 *           type: integer
 *           description: ID of the department
 *         isactive:
 *           type: boolean
 *           description: Whether the user account is active (default is true)
 *       example:
 *         name: "Jane Smith"
 *         email: "janesmith@example.com"
 *         password: "securepassword123"
 *         phone: "9876543210"
 *         country: "USA"
 *         town: "Los Angeles"
 *         street: "456 Elm Street"
 *         role: "Student"
 *         subscriptionstatus: "Inactive"
 *         level: "Graduate"
 *         departmentid: 3
 *         isactive: true
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: "johndoe@example.com"
 *         password: "password123"
 *
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token
 *       example:
 *         accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4uLi4="
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message detailing what went wrong
 *       example:
 *         error: "Incorrect password"
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 */

/**
 * @swagger
 * /sign_up:
 *   post:
 *     summary: Register a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user and obtain JWT tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful, tokens provided
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "refresh_token=abc123; HttpOnly; Secure"
 *             description: Refresh token set in HttpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Unauthorized access due to incorrect credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /refresh_token:
 *   get:
 *     summary: Refresh JWT tokens using the refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "refresh_token=def456; HttpOnly; Secure"
 *             description: New refresh token set in HttpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Unauthorized access due to missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden access due to invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /delete_token:
 *   delete:
 *     summary: Log out a user by deleting the refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Refresh token deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh token deleted."
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /google_auth:
 *   post:
 *     tags: [Authentication]
 *     summary: Google Sign-In and account creation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: The ID token received from Google Sign-In
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1... (truncated)
 *     responses:
 *       200:
 *         description: Successful authentication and user account creation or retrieval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: The JWT refresh token
 *                 user:
 *                   type: object
 *                   properties:
 *                     UserID:
 *                       type: integer
 *                       description: The ID of the user
 *                     Name:
 *                       type: string
 *                       description: The name of the user
 *                     Email:
 *                       type: string
 *                       description: The email of the user
 *                     Phone:
 *                       type: string
 *                       description: The phone number of the user
 *                     Country:
 *                       type: string
 *                       description: The country of the user
 *                     Town:
 *                       type: string
 *                       description: The town of the user
 *                     Street:
 *                       type: string
 *                       description: The street address of the user
 *                     Role:
 *                       type: string
 *                       description: The role of the user
 *                     SubscriptionStatus:
 *                       type: string
 *                       description: The subscription status of the user
 *                     Level:
 *                       type: string
 *                       description: The educational level of the user
 *                     DepartmentID:
 *                       type: integer
 *                       description: The ID of the department the user belongs to
 *                     RegistrationDate:
 *                       type: string
 *                       format: date-time
 *                       description: The registration date of the user
 *                     IsActive:
 *                       type: boolean
 *                       description: The activation status of the user
 *                 payload:
 *                   type: object
 *                   description: The complete payload returned by Google
 *       400:
 *         description: ID Token is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID Token is required
 *       401:
 *         description: Unauthorized due to invalid ID Token or error during authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
