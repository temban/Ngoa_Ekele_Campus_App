/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /upload_profile_picture/{id}:
 *   post:
 *     tags: [Users]
 *     summary: Upload a profile picture
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *       - name: profilePicture
 *         in: formData
 *         required: true
 *         type: file
 *         description: The profile picture to upload
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             profileImagePath:
 *               type: string
 *       400:
 *         description: No file uploaded
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /update_profile_picture/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a profile picture
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *       - name: profilePicture
 *         in: formData
 *         required: true
 *         type: file
 *         description: The new profile picture to upload
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             profileImagePath:
 *               type: string
 *       400:
 *         description: No file uploaded
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /delete_profile_picture/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a profile picture
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile picture deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /profile_picture/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user's profile picture
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile image URL
 *         schema:
 *           type: object
 *           properties:
 *             imageUrl:
 *               type: string
 *       404:
 *         description: User not found or profile image not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /get_users:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         schema:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userid:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   country:
 *                     type: string
 *                   town:
 *                     type: string
 *                   street:
 *                     type: string
 *                   role:
 *                     type: string
 *                   subscriptionstatus:
 *                     type: string
 *                   level:
 *                     type: string
 *                   registrationdate:
 *                     type: string
 *                   isactive:
 *                     type: boolean
 *                   profileimage:
 *                     type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         schema:
 *           type: object
 *           properties:
 *             userid:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             country:
 *               type: string
 *             town:
 *               type: string
 *             street:
 *               type: string
 *             role:
 *               type: string
 *             subscriptionstatus:
 *               type: string
 *             level:
 *               type: string
 *             registrationdate:
 *               type: string
 *             isactive:
 *               type: boolean
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /edit_user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Edit a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *       - name: user
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             phone:
 *               type: string
 *             country:
 *               type: string
 *             town:
 *               type: string
 *             street:
 *               type: string
 *             role:
 *               type: string
 *             subscriptionstatus:
 *               type: string
 *             level:
 *               type: string
 *             isactive:
 *               type: boolean
 *             departmentid:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /edit_password/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Change user password
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *       - name: passwords
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             oldPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             user:
 *               type: object
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       400:
 *         description: Old password is incorrect
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /activate_user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Activate a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User activated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /deactivate_user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Deactivate a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */

/**
 * @swagger
 * /delete_user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       404:
 *         description: User not found
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 */
