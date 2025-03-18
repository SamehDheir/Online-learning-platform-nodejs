const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      enum: ["Development", "Design", "Marketing", "Business", "Other"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
    studentsEnrolled: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        progress: { type: Number, default: 0 },
      },
    ],
    studentsCount: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: String,
      },
    ],
  },

  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
