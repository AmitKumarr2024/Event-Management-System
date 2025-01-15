import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../controllers/Event.Controller.js";

const router = express.Router();

// Event routes
router.post("/event", createEvent); // Create a new event
router.get("/event", getAllEvents); // Get all events
router.get("/event/:id", getEventById); // Get event by ID
router.patch("/event/:id", updateEvent); // Update event by ID
router.delete("/event/:id", deleteEvent); // Delete event by ID

export default router;
