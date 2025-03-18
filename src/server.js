require("dotenv").config();
const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");


const connectDB = require("./config/database");
const authRoute = require("./routes/auth.routes");

const courseRoute = require("./routes/course.routes");
const materialRoutes = require("./routes/material.routes");
const quizRoute = require("./routes/quiz.routes");
const questionRoutes = require("./routes/question.routes");
const notificationRoute = require("./routes/notification.routes");
const certificateRoutes = require("./routes/certificate.routes");
const messageRoutes = require("./routes/message.routes");
const chatRoutes = require("./routes/chat.routes");
const paymentRoutes = require("./routes/payment.routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");
const chatSocket = require("./sockets/chat.socket");
const app = express();

// Allow viewing of uploaded files
app.use(
  "/uploads/materials",
  express.static(path.join(__dirname, "uploads/materials"))
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Setting Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Learning Platform API",
      version: "1.0.0",
      description: "API documentation for Online Learning Platform",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["src/routes/*.js"],
};

app.use(express.json());

// Connect to the database
connectDB();

// Setting swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/questions", questionRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/quizzes", quizRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/payment", paymentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// WebSocket
chatSocket(io);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
