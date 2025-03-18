const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // التحقق من صحة البريد
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    resetPasswordCode: {
      type: String,
      select: false, // ❌ عدم جلبه في الاستعلامات الافتراضية
    },
    resetPasswordExpires: {
      type: Date,
      select: false, // ❌ عدم جلبه في الاستعلامات الافتراضية
    },
    quizResults: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        score: {
          type: Number,
          min: [0, "Score cannot be negative"],
        },
        percentage: {
          type: Number,
          min: [0, "Percentage cannot be negative"],
          max: [100, "Percentage cannot exceed 100"],
        },
      },
    ],
    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      required: true,
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);





// 📌 إضافة `virtual` لحساب عدد الكويزات المجتازة
userSchema.virtual("passedQuizzes").get(function () {
  return this.quizResults.filter((quiz) => quiz.percentage >= 50).length;
});

// 📩 إخفاء الحقول الحساسة عند الإرسال
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordCode;
  delete obj.resetPasswordExpires;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
