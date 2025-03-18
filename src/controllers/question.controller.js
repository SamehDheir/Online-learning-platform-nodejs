const Question = require("../models/question.model");

exports.askQuestion = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { question } = req.body;
    const studentId = req.user._id;

    if (!question) {
      return res.status(400).json({ message: "Question text is required" });
    }

    const newQuestion = new Question({ studentId, courseId, question });
    await newQuestion.save();

    res
      .status(201)
      .json({ message: "Question posted successfully!", newQuestion });
  } catch (error) {
    next(error);
  }
};

exports.answerQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;
    const instructorId = req.user._id;

    if (!answer) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (req.user.role !== "instructor") {
      return res
        .status(403)
        .json({ message: "Only instructors can answer questions" });
    }

    question.answers.push({ instructorId, answer, createdAt: new Date() });
    await question.save();

    res.status(200).json({ message: "Answer added successfully!", question });
  } catch (error) {
    next(error);
  }
};

exports.getCourseQuestions = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const questions = await Question.find({ courseId })
      .populate("studentId", "name")
      .populate("answers.instructorId", "name");

    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};


exports.deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
