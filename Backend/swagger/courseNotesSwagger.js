/**
 * @swagger
 * components:
 *   schemas:
 *     CourseNote:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *         - pdfUrl
 *       properties:
 *         noteid:
 *           type: integer
 *           description: Auto-generated ID of the course note
 *         courseid:
 *           type: integer
 *           description: ID of the associated course
 *         title:
 *           type: string
 *           description: Title of the course note
 *         pdfUrl:
 *           type: string
 *           description: URL of the uploaded PDF
 *       example:
 *         noteid: 1
 *         courseid: 101
 *         title: "Introduction to Geography"
 *         pdfUrl: "http://localhost:3000/CourseNotes/1696161420416.pdf"
 */

/**
 * @swagger
 * /cerate_course_notes:
 *   post:
 *     summary: Upload a new course note with PDF
 *     tags: [Course Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the associated course
 *               title:
 *                 type: string
 *                 description: Title of the course note
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to be uploaded
 *     responses:
 *       201:
 *         description: Course note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseNote'
 *       400:
 *         description: No PDF file uploaded
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /get_all_course_notes:
 *   get:
 *     summary: Retrieve all course notes
 *     tags: [Course Notes]
 *     responses:
 *       200:
 *         description: List of all course notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseNote'
 *       404:
 *         description: No course notes found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /course_note/{id}:
 *   get:
 *     summary: Retrieve a specific course note by ID
 *     tags: [Course Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the course note to retrieve
 *     responses:
 *       200:
 *         description: Course note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseNote'
 *       404:
 *         description: Course note not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /update_course_notes/{id}:
 *   put:
 *     summary: Update an existing course note by ID
 *     tags: [Course Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the course note to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the associated course
 *               title:
 *                 type: string
 *                 description: Title of the course note
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: Updated PDF file
 *     responses:
 *       200:
 *         description: Course note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseNote'
 *       404:
 *         description: Course note not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /delete_course_notes/{id}:
 *   delete:
 *     summary: Delete a course note by ID
 *     tags: [Course Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the course note to delete
 *     responses:
 *       200:
 *         description: Course note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedNote:
 *                   $ref: '#/components/schemas/CourseNote'
 *       404:
 *         description: Course note not found
 *       500:
 *         description: Server error
 */
