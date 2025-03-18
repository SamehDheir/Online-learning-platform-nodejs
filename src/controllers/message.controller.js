const Message = require("../models/message.model");
const Chat = require("../models/chat.model");

exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    const senderId = req.user ? req.user._id : null;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized: No sender found" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.participants.includes(senderId)) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this chat" });
    }

    const newMessage = new Message({
      chatId,
      sender: senderId,
      message,
    });

    await newMessage.save();
    chat.lastMessage = newMessage._id;
    await chat.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    // التأكد من وجود المحادثة
    const messages = await Message.find({ chatId })
      .populate("sender", "name email") // جلب بيانات المرسل (الاسم والإيميل)
      .sort({ createdAt: 1 }); // ترتيب الرسائل تصاعديًا (من الأقدم إلى الأحدث)

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};
