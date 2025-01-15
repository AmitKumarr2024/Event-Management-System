// routes/notificationRoutes.js
import express from 'express';
import { createNotification, deleteNotification, getNotificationsForUser, markNotificationAsRead } from '../controllers/Notification.controller.js';

const router = express.Router();

// Route to create a new notification
router.post('/notifications', createNotification);

// Route to get all notifications for a user
router.get('/notifications/user/:userId', getNotificationsForUser);

// Route to mark a notification as read
router.put('/notifications/read/:notificationId', markNotificationAsRead);

// Route to delete a notification
router.delete('/notifications/:notificationId', deleteNotification);

export default router;
