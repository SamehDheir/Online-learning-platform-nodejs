const Course = require("../models/course.model");
const User = require("../models/user.model");

exports.createCourse = async (req, res, next) => {
  try {
    const { title, description, price, category } = req.body;

    // Ensure all required fields are provided
    if (!title || !description || !price || !category) {
      res.status(400);
      throw new Error("All fields are required");
    }

    // Create a new course
    const newCourse = await Course.create({
      title,
      description,
      price,
      category,
      instructor: req.user._id,
    });

    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    next(error);
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const {
      title,
      category,
      minPrice,
      maxPrice,
      sortBy,
      order,
      minStudents,
      maxStudents,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    // Filter based on title
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // Filter based on category
    if (category) {
      filter.category = category;
    }

    // Filter by price
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    // Filter based on number of students
    if (minStudents || maxStudents) {
      filter.studentsEnrolled = {};
      if (minStudents) filter.studentsEnrolled.$gte = minStudents;
      if (maxStudents) filter.studentsEnrolled.$lte = maxStudents;
    }

    // Filter based on creation date
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Sort results based on query parameter
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    // Fetch all courses based on filters
    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .sort(sort);
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    // Fetch the course by ID along with the instructor details
    const course = await Course.findById(courseId).populate(
      "instructor",
      "username email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  const { courseId } = req.params;
  const { title, description, price, category } = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this course" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.category = category || course.category;

    await course.save();
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    next(error);
  }
};


exports.deleteCourse = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(courseId);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.enrollInCourse = async (req, res, next) => {
  const { courseId } = req.params;
  const studentId = req.user._id;
  const maxStudents = 50;

  try {
    const student = await User.findById(studentId);

    // Check student status
    if (!student || !student.isActive) {
      return res.status(400).json({
        message:
          "Your account is not active or you are not authorized to enroll",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the number of students has exceeded the maximum
    if (course.studentsEnrolled.length >= maxStudents) {
      return res
        .status(400)
        .json({ message: "Course is full, cannot enroll more students" });
    }

    // Check if the student is already enrolled in the course
    const alreadyEnrolled = course.studentsEnrolled.some(
      (s) => s.studentId.toString() === studentId.toString()
    );

    if (alreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    // Add the student to the registered list
    course.studentsEnrolled.push({ studentId, progress: 0 });

    // Update the number of students
    course.studentsCount = course.studentsEnrolled.length;

    await course.save();

    res
      .status(200)
      .json({ message: "You have successfully enrolled in the course" });
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  const { courseId } = req.params;
  const { progress } = req.body;
  const studentId = req.user._id;

  if (typeof progress !== "number" || progress < 0 || progress > 100) {
    return res
      .status(400)
      .json({ message: "Progress must be a number between 0 and 100" });
  }

  try {
    const course = await Course.findById(courseId).populate(
      "studentsEnrolled.studentId"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Search for the student in the matrix of registered students
    const studentIndex = course.studentsEnrolled.findIndex(
      (s) => s.studentId._id.toString() === studentId.toString()
    );

    if (studentIndex === -1) {
      return res
        .status(400)
        .json({ message: "You are not enrolled in this course" });
    }

    // Update progress
    course.studentsEnrolled[studentIndex].progress = progress;
    await course.save();

    res
      .status(200)
      .json({ message: "Progress updated successfully", progress });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  const { courseId } = req.params;
  const { rating, review } = req.body;
  const studentId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the student is enrolled in the course
    const studentProgress = course.studentsEnrolled.find(
      (s) => s.studentId.toString() === studentId.toString()
    );

    if (!studentProgress) {
      return res
        .status(400)
        .json({ message: "You are not enrolled in this course" });
    }

    const alreadyRated = course.ratings.some(
      (rating) => rating.studentId.toString() === studentId.toString()
    );

    if (alreadyRated) {
      return res
        .status(400)
        .json({ message: "Sorry, you have already added a rating" });
    }
    // Add review
    course.ratings.push({ studentId, rating, review });
    await course.save();

    res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getStudentRatings = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    // Find all courses that contain a rating from this student
    const courses = await Course.find({ "ratings.studentId": studentId })
      .select("title ratings")
      .populate({
        path: "ratings.studentId",
        select: "name",
      });

    if (!courses.length) {
      return res
        .status(404)
        .json({ message: "No ratings found for this student" });
    }

    // Extract evaluations for this student only
    const studentRatings = courses.map((course) => {
      return {
        courseTitle: course.title,
        rating: course.ratings.find(
          (r) => r.studentId._id.toString() === studentId.toString()
        ),
      };
    });

    res.status(200).json({ ratings: studentRatings });
  } catch (error) {
    next(error);
  }
};



