/**
 * @swagger
 * /upload_temp_result_pdf:
 *   post:
 *     summary: Uploads a result PDF and inserts result data into the database.
 *     tags: [Results]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: resultPDF
 *         in: formData
 *         description: The result PDF file to upload
 *         required: true
 *         type: file
 *       - name: StudentName
 *         in: formData
 *         description: Name of the student
 *         required: true
 *         type: string
 *       - name: StudentMatr
 *         in: formData
 *         description: Matriculation number of the student
 *         required: true
 *         type: string
 *       - name: Score
 *         in: formData
 *         description: Score of the student
 *         required: false
 *         type: number
 *       - name: CourseID
 *         in: formData
 *         description: ID of the course
 *         required: true
 *         type: integer
 *       - name: ExamTypeID
 *         in: formData
 *         description: ID of the exam type
 *         required: true
 *         type: integer
 *       - name: ResultDate
 *         in: formData
 *         description: Date of the result
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       201:
 *         description: Result PDF uploaded and data inserted successfully
 *       400:
 *         description: Bad request, e.g., no file uploaded or invalid exam type
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /update_result_pdf/{id}:
 *   put:
 *     summary: Updates the result PDF and result date for a specific result ID.
 *     tags: [Results]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the result to update
 *         required: true
 *         type: integer
 *       - name: resultPDF
 *         in: formData
 *         description: The result PDF file to upload
 *         required: true
 *         type: file
 *       - name: resultDate
 *         in: formData
 *         description: Date of the result
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       200:
 *         description: PDF and Result Date updated successfully
 *       400:
 *         description: Bad request, e.g., no file uploaded or current PDF is empty
 *       404:
 *         description: Result not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /result_pdf/{id}:
 *   get:
 *     summary: Retrieves the result PDF for a specific result ID.
 *     tags: [Results]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the result to retrieve
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: PDF result retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pdfUrl:
 *                   type: string
 *                   description: URL of the PDF file
 *       404:
 *         description: Result or PDF not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /result_pdfs/{date}:
 *   get:
 *     summary: Retrieves all result PDFs for a specific date.
 *     tags: [Results]
 *     parameters:
 *       - name: date
 *         in: path
 *         description: Date of the results to retrieve
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       200:
 *         description: PDF results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pdfLinks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       resultID:
 *                         type: integer
 *                       studentName:
 *                         type: string
 *                       studentMatr:
 *                         type: string
 *                       score:
 *                         type: number
 *                       total:
 *                         type: number
 *                       courseID:
 *                         type: integer
 *                       examTypeID:
 *                         type: integer
 *                       pdfUrl:
 *                         type: string
 *                       resultDate:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No results found for this date
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /excel_upload_results/courseid/{courseid}/examtypeid/{examtypeid}:
 *   post:
 *     summary: Uploads an Excel file and inserts results into the database.
 *     tags: [Results]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: courseid
 *         in: path
 *         description: ID of the course
 *         required: true
 *         type: integer
 *       - name: examtypeid
 *         in: path
 *         description: ID of the exam type
 *         required: true
 *         type: integer
 *       - name: file
 *         in: formData
 *         description: Excel file with results
 *         required: true
 *         type: file
 *       - name: resultdate
 *         in: formData
 *         description: Date of the results
 *         required: true
 *         type: string
 *         format: date
 *     responses:
 *       201:
 *         description: Results uploaded and inserted successfully
 *       400:
 *         description: Bad request, e.g., invalid data
 *       500:
 *         description: Server error
 */
