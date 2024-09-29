/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - departmentName
 *       properties:
 *         DepartmentID:
 *           type: integer
 *           description: Unique identifier for the department
 *         DepartmentName:
 *           type: string
 *           description: Name of the department
 */

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management API
 */

/**
 * @swagger
 * /create_department:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentName:
 *                 type: string
 *                 description: The name of the department to create
 *     responses:
 *       200:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Department name is required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /get_departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of all departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /department/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The department ID
 *     responses:
 *       200:
 *         description: The requested department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /update_departments/{id}:
 *   put:
 *     summary: Update a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentName:
 *                 type: string
 *                 description: The updated department name
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Department name is required
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /delete_department/{id}:
 *   delete:
 *     summary: Delete a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 department:
 *                   $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
