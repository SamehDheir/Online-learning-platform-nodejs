const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

exports.createPrivateChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const myId = req.user._id;

    // Ensure that the conversation does not already exist between users
    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [myId, userId] },
    });

    if (!chat) {
      chat = await Chat.create({
        isGroup: false,
        participants: [myId, userId],
      });
    }

    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.createGroupChat = async (req, res, next) => {
  try {
    const { name, participants } = req.body;
    const creatorId = req.user._id;

    if (!name || !participants || participants.length < 2) {
      return res.status(400).json({
        message: "You must enter a group name and at least two members.",
      });
    }

    const newGroup = await Chat.create({
      name,
      isGroup: true,
      participants: [...participants, creatorId],
      admins: [creatorId],
    });

    res.status(201).json(newGroup);
  } catch (error) {
    next(error);
  }
};

exports.addUserToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isGroup) {
      return res.status(404).json({ message: "The group does not exist" });
    }

    if (chat.participants.includes(userId)) {
      return res.status(400).json({
        message: "The user is already in the groupUser added successfully",
      });
    }

    chat.participants.push(userId);
    await chat.save();

    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    // استرجاع المحادثات التي تحتوي على المستخدم
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name") // استرجاع أسماء المشاركين
      .populate("lastMessage") // استرجاع آخر رسالة في المحادثة
      .sort({ updatedAt: -1 }); // ترتيب المحادثات حسب آخر تحديث (اختياري)

    if (chats.length === 0) {
      return res.status(404).json({ message: "No chats found for this user" });
    }

    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error(error); // لعرض الخطأ في السيرفر
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching chats",
      });
  }
};

exports.removeUserFromGroup = async (req, res) => {
  try {
    const { chatId, userIdToRemove } = req.body;
    const userId = req.user._id; // المستخدم الذي قام بحذف العضو

    // العثور على المحادثة
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // التأكد أن المستخدم هو أحد المشاركين في المحادثة
    if (!chat.participants.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a participant of this group" });
    }

    // إزالة العضو المستهدف من المشاركين
    const updatedParticipants = chat.participants.filter(
      (participant) => participant.toString() !== userIdToRemove
    );

    chat.participants = updatedParticipants;

    // إذا كان عدد المشاركين أقل من 2، نحذف المحادثة والرسائل
    if (chat.participants.length < 2) {
      // حذف جميع الرسائل المتعلقة بالمحادثة
      await Message.deleteMany({ chatId });

      // حذف المحادثة
      await Chat.findByIdAndDelete(chatId);
      return res
        .status(200)
        .json({
          message:
            "Chat and messages deleted as the group had less than 2 participants",
        });
    }

    // حفظ التحديثات
    await chat.save();
    res
      .status(200)
      .json({ message: "User removed successfully from the group" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while removing the user" });
  }
};