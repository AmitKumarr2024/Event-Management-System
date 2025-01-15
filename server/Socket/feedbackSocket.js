import { io } from '../index.js';  // Assuming io is exported from your main server file
import logger from '../utils/logger.js';  // Assuming logger is set up

// Setup feedback-specific socket events
export const setupFeedbackSocket = (socket) => {
  // Listen for new feedback submissions from clients
  socket.on('submitFeedback', async (feedbackData) => {
    try {
      // Emit the new feedback to all clients (except the sender)
      io.emit('newFeedback', feedbackData);

      logger.info('New feedback submitted', { feedbackData });

    } catch (error) {
      logger.error('Error submitting feedback', { error: error.message });
    }
  });

  // Listen for mark feedback as read requests from clients
  socket.on('markFeedbackAsRead', async (feedbackId) => {
    try {
      // Emit the updated feedback status to all clients
      io.emit('feedbackRead', { feedbackId, status: 'read' });

      logger.info(`Feedback with ID ${feedbackId} marked as read.`);

    } catch (error) {
      logger.error('Error marking feedback as read', { error: error.message });
    }
  });

  // Listen for feedback deletion requests from clients
  socket.on('deleteFeedback', async (feedbackId) => {
    try {
      // Emit the deletion event to all clients
      io.emit('feedbackDeleted', feedbackId);

      logger.info(`Feedback with ID ${feedbackId} deleted.`);

    } catch (error) {
      logger.error('Error deleting feedback', { error: error.message });
    }
  });

  // You can add more events as necessary for other feedback-related interactions
};
