const express = require("express");
const {
  askQuestion,
  answerQuestion,
  getCourseQuestions,
  deleteQuestion,
} = require("../controllers/question.controller");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - studentId
 *         - courseId
 *         - question
 *       properties:
 *         studentId:
 *           type: string
 *           description: The ID of the student who asked the question
 *         courseId:
 *           type: string
 *           description: The ID of the course the question belongs to
 *         question:
 *           type: string
 *           description: The question text
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               instructorId:
 *                 type: string
 *                 description: The ID of the instructor who answered the question
 *               answer:
 *                 type: string
 *                 description: The answer to the question
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The timestamp when the answer was created
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the question was created
 *       example:
 *         studentId: "603d2f3d19e14d45c4e8f540"
 *         courseId: "603d2f3d19e14d45c4e8f542"
 *         question: "How do I submit my assignment?"
 *         answers:
 *           - instructorId: "603d2f3d19e14d45c4e8f543"
 *             answer: "You can submit your assignment via the course portal."
 *             createdAt: "2025-03-22T14:00:00Z"
 *         createdAt: "2025-03-22T12:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Ask and answer questions for courses
 */

/**
 * @swagger
 * /api/questions/ask/{courseId}:
 *   post:
 *     summary: Ask a question in a course
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The course ID where the question is being asked
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question being asked
 *             required:
 *               - question
 *     responses:
 *       201:
 *         description: Question posted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question posted successfully!
 *                 newQuestion:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Bad request, missing question text
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/questions/answer/{questionId}:
 *   post:
 *     summary: Answer a question in a course
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: The question ID to be answered
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: string
 *                 description: The answer to the question
 *             required:
 *               - answer
 *     responses:
 *       200:
 *         description: Answer added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Answer added successfully!
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Bad request, missing answer text
 *       404:
 *         description: Question not found
 *       403:
 *         description: Only instructors can answer questions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/questions/{courseId}:
 *   get:
 *     summary: Get all questions for a course
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The course ID to fetch questions for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of questions in the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       400:
 *         description: Bad request, missing course ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/questions/{questionId}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         description: The question ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */


router.post(
  "/ask/:courseId",
  protect,
  checkRole("instructor", "student"),
  askQuestion
);
router.post(
  "/answer/:questionId",
  protect,
  checkRole("instructor", "student"),
  answerQuestion
);
router.get("/:courseId", protect, checkRole("instructor"), getCourseQuestions);
router.delete("/:questionId", protect, checkRole("instructor"), deleteQuestion);

module.exports = router;
