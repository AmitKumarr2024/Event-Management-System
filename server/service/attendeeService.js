import Attendee from "../models/Attendee.models.js";
import Event from "../models/Event.models.js";

// Register an attendee for an event
export const registerAttendeeService = async (eventId, userId) => {
  try {
    console.debug("Registering attendee:", { eventId, userId });

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    console.debug("Event found:", event);

    // Ensure attendees is an array (in case it's not properly initialized)
    if (!Array.isArray(event.attendees)) {
      console.debug("Initializing attendees array");
      event.attendees = [];
    }

    // Create a new attendee
    const newAttendee = new Attendee({ event: eventId, user: userId });
    console.debug("New attendee:", newAttendee);

    await newAttendee.save();

    // Add the attendee to the event's attendee list
    event.attendees.push(newAttendee._id);
    await event.save();

    console.debug("Attendee registered:", newAttendee);
    return newAttendee;
  } catch (error) {
    console.error("Error registering attendee:", error.message);
    throw error;
  }
};



// Get all attendees for a specific event
export const getAttendeesForEventService = async (eventId) => {
  try {
    console.debug("Fetching attendees for event:", eventId);

    // Find the event and populate the attendees
    const event = await Event.findById(eventId).populate("attendees");
    if (!event) {
      throw new Error("Event not found");
    }

    console.debug("Attendees found for event:", event.attendees);
    return event.attendees;
  } catch (error) {
    console.error("Error fetching attendees for event:", error.message);
    throw error;
  }
};

// Get all events for a specific attendee
export const getEventsForAttendeeService = async (userId) => {
  try {
    console.debug("Fetching events for attendee:", userId);

    // Find all attendee records for the given user
    const attendeeRecords = await Attendee.find({ user: userId }).populate("event");
    if (!attendeeRecords || attendeeRecords.length === 0) {
      throw new Error("No events found for this attendee");
    }

    // Extract and return the events from the attendee records
    const events = attendeeRecords.map((record) => record.event);
    console.debug("Events found for attendee:", events);

    return events;
  } catch (error) {
    console.error("Error fetching events for attendee:", error.message);
    throw error;
  }
};

// Remove an attendee from an event
export const removeAttendeeService = async (eventId, userId) => {
  try {
    console.debug("Removing attendee from event:", { eventId, userId });

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Find and delete the attendee
    const attendee = await Attendee.findOneAndDelete({ event: eventId, user: userId });
    if (!attendee) {
      throw new Error("Attendee not found");
    }

    // Remove the attendee from the event's attendees list
    event.attendees = event.attendees.filter((att) => att.toString() !== attendee._id.toString());
    await event.save();

    console.debug("Attendee removed from event:", attendee);
    return attendee;
  } catch (error) {
    console.error("Error removing attendee from event:", error.message);
    throw error;
  }
};
