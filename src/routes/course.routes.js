const express = require("express");
const {
  createCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
  enrollInCourse,
  getCourseById,
  updateProgress,
  addReview,
  getStudentRatings,
} = require("../controllers/course.controller");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the course
 *         description:
 *           type: string
 *           description: The description of the course
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the course
 *         category:
 *           type: string
 *           description: The category of the course
 *         instructor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *           description: The instructor information
 *       example:
 *         title: "JavaScript Basics"
 *         description: "Learn the fundamentals of JavaScript."
 *         price: 99.99
 *         category: "Development"
 *         instructor:
 *           _id: "605b5f7e0f3b8d3e2a287840"
 *           name: "John Doe"
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     description: Allows instructors to create a new course.
 *     tags:
 *       - Course Management
 *     requestBody:
 *       description: Course data to create a new course
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid input data
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve a list of all courses.
 *     tags:
 *       - Course Management
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       404:
 *         description: No courses found
 */

/**
 * @swagger
 * /api/courses/{courseId}:
 *   get:
 *     summary: Get a course by ID
 *     description: Retrieve a course by its ID.
 *     tags:
 *       - Course Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /api/courses/{courseId}:
 *   put:
 *     summary: Update a course
 *     description: Allows instructors to update an existing course.
 *     tags:
 *       - Course Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated course data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid course data
 *       404:
 *         description: Course not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/courses/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     description: Allows instructors to delete a course.
 *     tags:
 *       - Course Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     description: Allows students to enroll in a course.
 *     tags:
 *       - Course Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course to enroll in
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully enrolled in the course
 *       400:
 *         description: Course is full or student already enrolled
 *       404:
 *         description: Course not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/courses/{courseId}/progress:
 *   post:
 *     summary: Update student progress
 *     description: Allows students to update their progress in a course.
 *     tags:
 *       - Course Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course to update progress for
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Student progress (0 to 100)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progress:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Invalid progress value
 *       404:
 *         description: Course or student not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/courses/{courseId}/review:
 *   post:
 *     summary: Add a review for a course
 *     description: Allows students to add a review and rating for a course.
 *     tags:
 *       - Course Management
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         description: The ID of the course to add a review for
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The review and rating for the course
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review added successfully
 *       400:
 *         description: Invalid rating or review
 *       404:
 *         description: Course not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/students/{studentId}/ratings:
 *   get:
 *     summary: Get all ratings by a student
 *     description: Allows admins, instructors, and students to retrieve a student's ratings for courses.
 *     tags:
 *       - Course Management
 *     parameters:
 *       - name: studentId
 *         in: path
 *         required: true
 *         description: The ID of the student whose ratings are to be fetched
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student ratings successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   courseTitle:
 *                     type: string
 *                   rating:
 *                     type: number
 *       404:
 *         description: No ratings found for the student
 *     security:
 *       - bearerAuth: []
 */

router.post("/", protect, checkRole("instructor"), createCourse);
router.get("/", getAllCourses);
router.get("/:courseId", getCourseById);
router.delete("/:courseId", protect, deleteCourse);
router.put("/:courseId", protect, checkRole("instructor"), updateCourse);
router.post("/:courseId/enroll", protect, checkRole("student"), enrollInCourse);
router.post(
  "/:courseId/progress",
  protect,
  checkRole("student"),
  updateProgress
);
router.post("/:courseId/review", protect, checkRole("student"), addReview);
router.get(
  "/:studentId/ratings",
  protect,
  checkRole("admin", "instructor", "student"),
  getStudentRatings
);

module.exports = router;
