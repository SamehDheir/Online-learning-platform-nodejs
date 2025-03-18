const express = require("express");
const {
  askQuestion,
  answerQuestion,
  getCourseQuestions,
  deleteQuestion,
} = require("../controllers/question.controller");
const { protect, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

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
