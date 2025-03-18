const Notification = require("../models/notification.model");

const sendInternalNotification = async (userId, message) => {
  try {
    const notification = new Notification({ userId, message });
    await notification.save();
    console.log("🔔 Internal notification saved!");
  } catch (error) {
    console.error("❌ Error saving notification:", error);
  }
};

module.exports = { sendInternalNotification };
