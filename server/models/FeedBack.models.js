// src/models/feedback.js
import mongoose from 'mongoose';

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model for user references
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500  // You can adjust the max length as needed
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true  // Assuming a 1-5 star rating system
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'responded'],  // Can track feedback status
    default: 'pending'  // Default status is 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now  // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now  // Automatically set the update date
  }
});

// Middleware to update the updatedAt field on save or update
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
