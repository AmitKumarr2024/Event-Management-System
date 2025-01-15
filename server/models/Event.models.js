import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > Date.now(); // Prevent past dates
        },
        message: "Event date must be in the future",
      },
    },
    location: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendee" }],  // Added attendees field
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed"],
      default: "pending",
    },
    image: { type: String, default: "" },
    category: {
      type: String,
      enum: ["workshop", "meetup", "conference", "webinar"],
    },
    startTime: { type: Date },
    endTime: { type: Date },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

eventSchema.index({ date: 1 }); // Index for quick lookups

export default mongoose.model("Event", eventSchema);
