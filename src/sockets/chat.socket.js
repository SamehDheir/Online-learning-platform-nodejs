const Message = require("../models/message.model");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    socket.on("sendMessage", async (data) => {
      const { sender, receiver, message } = data;
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      io.emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
