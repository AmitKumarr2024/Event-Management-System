import Event from '../models/Event.models.js';
import logger from '../utils/logger.js';  // Assuming logger is set up

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, createdBy } = req.body;

    // Create a new event instance
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      createdBy,
    });

    // Save the event to the database
    const savedEvent = await newEvent.save();

    logger.info('New event created', { eventId: savedEvent._id, title, createdBy });

    // Send the response with the saved event
    res.status(201).json(savedEvent);
  } catch (error) {
    logger.error('Error in createEvent', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    // Fetch all events from the database
    const events = await Event.find();

    logger.info('Fetched all events', { eventsCount: events.length });

    // Send the response with the events
    res.status(200).json(events);
  } catch (error) {
    logger.error('Error in getAllEvents', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the event by ID
    const event = await Event.findById(id);

    // If event not found
    if (!event) {
      logger.warn('Event not found', { eventId: id });
      return res.status(404).json({ message: 'Event not found' });
    }

    logger.info('Fetched event by ID', { eventId: event._id, title: event.title });

    // Send the event details as response
    res.status(200).json(event);
  } catch (error) {
    logger.error('Error in getEventById', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Update an event by ID
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location } = req.body;

    // Find the event by ID and update
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, location },
      { new: true }
    );

    // If event not found
    if (!updatedEvent) {
      logger.warn('Event not found for update', { eventId: id });
      return res.status(404).json({ message: 'Event not found' });
    }

    logger.info('Event updated', { eventId: updatedEvent._id, title: updatedEvent.title });

    // Send the updated event details as response
    res.status(200).json(updatedEvent);
  } catch (error) {
    logger.error('Error in updateEvent', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the event by ID and delete
    const deletedEvent = await Event.findByIdAndDelete(id);

    // If event not found
    if (!deletedEvent) {
      logger.warn('Event not found for deletion', { eventId: id });
      return res.status(404).json({ message: 'Event not found' });
    }

    logger.info('Event deleted successfully', { eventId: deletedEvent._id });

    // Send success response
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    logger.error('Error in deleteEvent', { error: error.message });
    res.status(500).json({ message: error.message });
  }
};
