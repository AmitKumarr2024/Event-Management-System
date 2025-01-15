// src/routes/feedback.routes.js
import express from "express";
import {
  createFeedback,
  markFeedbackAsRead,
  deleteFeedback,
  getFeedbackForUser,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// Route to create new feedback
router.post("/feedback", createFeedback);

// Route to mark feedback as read
router.put("/feedback/read/:feedbackId", markFeedbackAsRead);

// Route to delete feedback
router.delete("/feedback/:feedbackId", deleteFeedback);

// Route to get feedback for a specific user
router.get("/feedback/user/:userId", getFeedbackForUser);

export default router;
