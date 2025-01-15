import Notification from '../models/Notification.models.js';  // Adjust the import path as needed
import { io } from '../index.js'; // Assuming io is exported from your main server file
import logger from '../utils/logger.js'; // Assuming logger is set up

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { message } = req.body;

    // Create and save the notification
    const newNotification = new Notification({ message });
    await newNotification.save();

    // Emit the new notification to all clients
    io.emit('newNotification', newNotification);

    logger.info('New notification created', { notificationId: newNotification._id, message: newNotification.message });

    res.status(201).json(newNotification);
  } catch (error) {
    logger.error('Error in createNotification', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { status: 'read' },
      { new: true }
    );

    // Emit the updated notification to all clients
    io.emit('notificationRead', notification);

    logger.info('Notification marked as read', { notificationId: notification._id, status: notification.status });

    res.status(200).json(notification);
  } catch (error) {
    logger.error('Error in markNotificationAsRead', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId);

    // Emit the deletion event to all clients
    io.emit('notificationDeleted', notification);

    logger.info('Notification deleted', { notificationId: notification._id });

    res.status(200).json({ message: 'Notification deleted', notification });
  } catch (error) {
    logger.error('Error in deleteNotification', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Get notifications for a user
export const getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    logger.info('Notifications fetched for user', { userId: req.params.userId, notificationsCount: notifications.length });
    res.status(200).json(notifications);
  } catch (error) {
    logger.error('Error in getNotificationsForUser', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
