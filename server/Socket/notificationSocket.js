import { io } from "../index.js"; // Import the io instance from the server
import logger from '../utils/logger.js';  // Assuming logger is set up

export function setupNotificationSocket(socket) {
  // Handle the 'sendNotification' event
  socket.on("sendNotification", (data) => {
    try {
      logger.info('New notification sent:', { data });
      // Emit the notification to all connected clients
      socket.broadcast.emit("newNotification", data); // Send to all except sender
    } catch (error) {
      logger.error('Error in sendNotification:', { error: error.message });
    }
  });

  // Handle when a notification is marked as read
  socket.on("markNotificationRead", (notificationId) => {
    try {
      logger.info(`Notification ${notificationId} marked as read`);
      // Emit the read notification event to all clients
      socket.broadcast.emit("notificationRead", notificationId);
    } catch (error) {
      logger.error('Error in markNotificationRead:', { error: error.message });
    }
  });

  // Handle notification deletion
  socket.on("deleteNotification", (notificationId) => {
    try {
      logger.info(`Notification ${notificationId} deleted`);
      // Emit the deleted notification event to all clients
      socket.broadcast.emit("notificationDeleted", notificationId);
    } catch (error) {
      logger.error('Error in deleteNotification:', { error: error.message });
    }
  });
}
