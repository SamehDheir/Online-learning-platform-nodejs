const express = require("express");
const {
  addQuizToCourse,
  getQuizzesForCourse,
  updateQuizForCourse,
  submitQuizAnswers,
} = require("../controllers/quiz.controller");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       required:
 *         - course
 *         - title
 *         - questions
 *       properties:
 *         course:
 *           type: string
 *           description: The ID of the course to which the quiz belongs
 *         title:
 *           type: string
 *           description: The title of the quiz
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 description: The text of the question
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The options available for the question
 *               correctAnswer:
 *                 type: string
 *                 description: The correct answer for the question
 *       example:
 *         course: "605b5f7e0f3b8d3e2a287840"
 *         title: "JavaScript Basics Quiz"
 *         questions:
 *           - questionText: "What is the result of 2 + 2?"
 *             options:
 *               - "4"
 *               - "5"
 *               - "3"
 *             correctAnswer: "4"
 */

/**
 * @swagger
 * /api/quiz/{courseId}:
 *   post:
 *     summary: Add a new quiz to a course
 *     description: Allows admins and instructors to add a quiz to a specific course
 *     tags:
 *       - Quiz Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The quiz to be added to the course
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Bad request (Invalid questions)
 *       404:
 *         description: Course not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/quiz/{courseId}:
 *   get:
 *     summary: Get all quizzes for a specific course
 *     description: Allows students, instructors, and admins to get all quizzes for a course
 *     tags:
 *       - Quiz Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The course ID to fetch quizzes
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quizzes successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: No quizzes found for this course
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/quiz/{courseId}/{quizId}:
 *   put:
 *     summary: Update an existing quiz for a course
 *     description: Allows admins and instructors to update an existing quiz for a course
 *     tags:
 *       - Quiz Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course
 *         schema:
 *           type: string
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated quiz information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       200:
 *         description: Quiz successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid quiz or questions format
 *       404:
 *         description: Quiz or course not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/quiz/{quizId}/submit:
 *   post:
 *     summary: Submit answers for a quiz
 *     description: Allows students to submit their answers for a specific quiz
 *     tags:
 *       - Quiz Management
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The answers for the quiz
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The answers for the quiz
 *     responses:
 *       200:
 *         description: Answers successfully submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   description: The score of the student
 *                 percentage:
 *                   type: number
 *                   description: The percentage of correct answers
 *       400:
 *         description: Invalid answers or already submitted
 *       404:
 *         description: Quiz or student not found
 *     security:
 *       - bearerAuth: []
 */


router.post(
  "/:courseId",
  protect,
  checkRole("admin", "instructor"),
  addQuizToCourse
);

router.get(
  "/:courseId",
  protect,
  checkRole("admin", "instructor", "student"),
  getQuizzesForCourse
);

router.put(
  "/:courseId/:quizId",
  protect,
  checkRole("admin", "instructor"),
  updateQuizForCourse
);

router.post(
  "/:quizId/submit",
  protect,
  checkRole("student"),
  submitQuizAnswers
);

module.exports = router;
