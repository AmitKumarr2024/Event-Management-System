import express from "express";
import {
  getAttendeesForEvent,
  getEventsForAttendee,
  registerAttendee,
  removeAttendee,
} from "../controllers/attendee.controller.js";

const router = express.Router();

// Attendee routes
router.post("/register", registerAttendee); // Register an attendee for an event
router.get("/event/:eventId", getAttendeesForEvent); // Get attendees for a specific event
router.get("/user/:userId", getEventsForAttendee); // Get events for a specific attendee
router.delete("/:eventId/:userId", removeAttendee); // Remove an attendee from an event

export default router;
