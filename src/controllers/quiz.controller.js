const Course = require("../models/course.model");
const Notification = require("../models/notification.model");
const Quiz = require("../models/quiz.model");
const User = require("../models/user.model");
const {
  sendInternalNotification,
} = require("../services/notification.service");

// Create a new Quiz for course
exports.addQuizToCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, questions } = req.body;

    // Check for the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found with the given ID" });
    }

    // Check the validity of the questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Questions must be provided and be an array" });
    }

    // Check that each question contains the correct text and answers.
    for (const question of questions) {
      if (
        !question.questionText ||
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        return res.status(400).json({
          message:
            "Each question must have question text and at least two options",
        });
      }
    }

    // Create a new quiz
    const quiz = new Quiz({ course: courseId, title, questions });
    await quiz.save();

    res.status(201).json({
      message: "Quiz added successfully",
      quizId: quiz._id,
      quizTitle: quiz.title,
      quizQuestions: quiz.questions.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get quiz for course by ID
exports.getQuizzesForCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Bring the course quiz
    const quizzes = await Quiz.find({ course: courseId }).select(
      "title questions"
    );

    if (!quizzes.length) {
      return res.status(404).json({
        message:
          "No quizzes found for this course. Please ensure the course has quizzes.",
      });
    }

    res.status(200).json({ quizzes });
  } catch (error) {
    next(error);
  }
};

//
exports.updateQuizForCourse = async (req, res, next) => {
  try {
    const { courseId, quizId } = req.params;
    const { title, questions } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Search for a course-related test
    const quiz = await Quiz.findOne({ _id: quizId, course: courseId });
    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Quiz not found for this course" });
    }

    // Update the address if it was sent in the request.
    if (title) {
      quiz.title = title;
    }

    // Validate questions before updating them.
    if (questions) {
      if (!Array.isArray(questions) || questions.length === 0) {
        return res
          .status(400)
          .json({ message: "Questions must be a non-empty array" });
      }

      for (const question of questions) {
        if (
          !question.questionText ||
          !Array.isArray(question.options) ||
          question.options.length < 2
        ) {
          return res.status(400).json({
            message:
              "Each question must have question text and at least two options",
          });
        }
      }

      quiz.questions = questions;
    }

    await quiz.save();

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// Providing the student with answers and calculating his score for each quiz
exports.submitQuizAnswers = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user._id;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId).populate("course");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student has taken the quiz before
    const alreadySubmitted = student.quizResults.some(
      (result) => result.quizId.toString() === quizId
    );

    if (alreadySubmitted) {
      return res
        .status(400)
        .json({ message: "You have already submitted this quiz" });
    }

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Invalid answers format" });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const percentage = (score / quiz.questions.length) * 100;

    // Add the result with the courseId
    student.quizResults.push({
      quizId,
      courseId: quiz.course._id,
      score,
      percentage,
    });

    await student.save();
    await Notification.create({
      studentId,
      message: "🎉 You have completed the quiz 🚀.",
    });
    res
      .status(200)
      .json({ message: "Quiz submitted successfully", score, percentage });
  } catch (error) {
    next(error);
  }
};
