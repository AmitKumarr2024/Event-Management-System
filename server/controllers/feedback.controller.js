import Feedback from '../models/FeedBack.models.js';  // Adjust according to your Feedback model
import { io } from '../index.js';            // Assuming io is exported from your main server file
import logger from '../utils/logger.js';  // Assuming logger is set up

// Create a feedback
export const createFeedback = async (req, res) => {
  try {
    const { userId, content, rating } = req.body;  // Example feedback structure

    // Create and save the feedback
    const newFeedback = new Feedback({ userId, content, rating });
    await newFeedback.save();

    // Emit the new feedback to all clients (optional)
    io.emit('newFeedback', newFeedback);

    logger.info('New feedback created', { feedbackId: newFeedback._id, userId, content, rating });

    res.status(201).json(newFeedback);
  } catch (error) {
    logger.error('Error in createFeedback', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Mark feedback as read or responded
export const markFeedbackAsRead = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.feedbackId,
      { status: 'read' },  // Assuming a 'status' field to track if the feedback was addressed
      { new: true }
    );

    // Emit the updated feedback to clients (optional)
    io.emit('feedbackRead', feedback);

    logger.info('Feedback marked as read', { feedbackId: feedback._id, status: feedback.status });

    res.status(200).json(feedback);
  } catch (error) {
    logger.error('Error in markFeedbackAsRead', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Delete a feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.feedbackId);

    // Emit the deletion event to clients (optional)
    io.emit('feedbackDeleted', feedback);

    logger.info('Feedback deleted', { feedbackId: feedback._id });

    res.status(200).json({ message: 'Feedback deleted', feedback });
  } catch (error) {
    logger.error('Error in deleteFeedback', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// Get feedback for a specific user or product (can be extended)
export const getFeedbackForUser = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.params.userId });

    logger.info('Feedback fetched for user', { userId: req.params.userId, feedbackCount: feedback.length });

    res.status(200).json(feedback);
  } catch (error) {
    logger.error('Error in getFeedbackForUser', { error: error.message });
    res.status(500).json({ error: error.message });
  }
};
