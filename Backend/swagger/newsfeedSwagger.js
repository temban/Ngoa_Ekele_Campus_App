/**
 * @swagger
 * components:
 *   schemas:
 *     NewsFeed:
 *       type: object
 *       required:
 *         - NoteTitle
 *         - Content
 *       properties:
 *         NoteTitle:
 *           type: string
 *           description: Title of the news feed.
 *         Content:
 *           type: string
 *           description: Content of the news feed.
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Array of up to 4 image files.
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: Timestamp of news feed creation.
 */

/**
 * @swagger
 * /create_newsfeed:
 *   post:
 *     summary: Create a new news feed
 *     tags: [NewsFeed]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               NoteTitle:
 *                 type: string
 *               Content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: News feed created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsFeed'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /get_all_newsfeed:
 *   get:
 *     summary: Get all news feeds
 *     tags: [NewsFeed]
 *     responses:
 *       200:
 *         description: List of all news feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewsFeed'
 *       404:
 *         description: No news feeds found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /newsfeed/{id}:
 *   get:
 *     summary: Get a news feed by ID
 *     tags: [NewsFeed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the news feed
 *     responses:
 *       200:
 *         description: The specific news feed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewsFeed'
 *       404:
 *         description: News feed not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /update_newsfeed/{id}:
 *   put:
 *     summary: Update a specific news feed by ID
 *     tags: [NewsFeed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the news feed to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               NoteTitle:
 *                 type: string
 *               Content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: News feed updated successfully
 *       400:
 *         description: No fields to update
 *       404:
 *         description: News feed not found for update
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /newsfeed/{id}:
 *   delete:
 *     summary: Delete a specific news feed by ID
 *     tags: [NewsFeed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the news feed to delete
 *     responses:
 *       200:
 *         description: News feed deleted successfully
 *       404:
 *         description: News feed not found for deletion
 *       500:
 *         description: Internal server error
 */
