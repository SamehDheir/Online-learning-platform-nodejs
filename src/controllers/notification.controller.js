const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const { sendNotificationEmail } = require("../services/email.service");

exports.completeCourse = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ error: "User ID and Course ID are required." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "courses.courseId": courseId },
      { $set: { "courses.$.completed": true } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or course not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const notification = new Notification({
      userId: userId,
      message: `🎉 Congratulations! You have completed the course: ${courseId}`,
    });
    await notification.save();

    await sendNotificationEmail(
      user.email,
      "🎉 Congratulations on completing a course!",
      `Hi ${user.name},\n\nYou have successfully completed your course. Keep going! 🚀`
    );

    res.status(200).json({
      message: "Course completed, notification created, and email sent!",
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
   next(error);
  }
};

exports.readNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required." });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read!", notification });
  } catch (error) {
    next(error);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All notifications marked as read!" });
  } catch (error) {
    next(error);
  }
};
