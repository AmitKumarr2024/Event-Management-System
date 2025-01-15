import {
  registerAttendeeService,
  getAttendeesForEventService,
  removeAttendeeService,
  getEventsForAttendeeService
} from "../service/attendeeService.js";
import logger from "../utils/logger.js";  // Assuming logger is set up

export const registerAttendee = async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    logger.info('Registering attendee', { eventId, userId });

    const attendee = await registerAttendeeService(eventId, userId);

    // Emit a socket event for real-time updates
    req.io.to(`event_${eventId}`).emit("attendeeRegistered", attendee);

    logger.info('Attendee registered successfully', { eventId, userId, attendeeId: attendee._id });

    res.status(201).json(attendee);
  } catch (error) {
    logger.error('Error in registering attendee', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const getAttendeesForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    logger.info('Fetching attendees for event', { eventId });

    const attendees = await getAttendeesForEventService(eventId);

    logger.info('Fetched attendees for event', { eventId, attendeesCount: attendees.length });

    res.status(200).json(attendees);
  } catch (error) {
    logger.error('Error in fetching attendees for event', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const getEventsForAttendee = async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info('Fetching events for attendee', { userId });

    const events = await getEventsForAttendeeService(userId);

    logger.info('Fetched events for attendee', { userId, eventsCount: events.length });

    res.status(200).json(events);
  } catch (error) {
    logger.error('Error in fetching events for attendee', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const removeAttendee = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    logger.info('Removing attendee', { eventId, userId });

    const attendee = await removeAttendeeService(eventId, userId);

    // Emit a socket event for real-time updates
    req.io.to(`event_${eventId}`).emit("attendeeRemoved", attendee._id);

    logger.info('Attendee removed successfully', { eventId, userId, attendeeId: attendee._id });

    res.status(200).json({ message: "Attendee removed successfully" });
  } catch (error) {
    logger.error('Error in removing attendee', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};
