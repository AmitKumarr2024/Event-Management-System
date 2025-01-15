import express from "express";
import { PORT } from "./config/env.js";
import MongoDb from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import CORS from "cors";
import UserRoutes from "../server/routes/User.routes.js";
import EventRoutes from "../server/routes/event.routes.js";
import notificationRouter from "../server/routes/notification.routes.js";
import FeedbackRoutes from "../server/routes/Feedback.routes.js";
import AttendanceRoutes from "../server/routes/attendee.routes.js";
import http from "http";
import { Server } from "socket.io"; // Correct import for socket.io v4.x
import { setupNotificationSocket } from "../server/Socket/notificationSocket.js"; // Import notification socket handler
import { setupFeedbackSocket } from "../server/Socket/feedbackSocket.js"; // Import feedback socket handler
import logger from './utils/logger.js';  // Assuming logger is set up

// Create an HTTP server to work with socket.io
const app = express();
const server = http.createServer(app);

// Create a socket.io instance
export const io = new Server(server);

// Use CORS middleware
app.use(CORS());

app.use(express.json());
app.use(cookieParser());

// Define your routes
app.use("/api/users/", UserRoutes);
app.use("/api/events/", EventRoutes);
app.use("/api/notification/", notificationRouter);
app.use("/api/attendance/", AttendanceRoutes);
app.use("/api/feedback/", FeedbackRoutes);

// Socket.io connection and events
io.on("connection", (socket) => {
  logger.info("A user connected to socket");

  // Set up notification-specific socket events
  setupNotificationSocket(socket);

  // Set up feedback-specific socket events
  setupFeedbackSocket(socket);

  // Handle disconnect
  socket.on("disconnect", () => {
    logger.info("User disconnected from socket");
  });
});

// Start the server and connect to MongoDB
server.listen(PORT, () => {
  logger.info(`Server running successfully at port: ${PORT}`);
  MongoDb(); // Connect to MongoDB
});
