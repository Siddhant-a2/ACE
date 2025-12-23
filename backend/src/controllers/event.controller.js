// Import Event model to interact with events collection
import Event from "../models/event.model.js";


// ===================== ADD EVENT CONTROLLER =====================
export const addEvent = async (req, res) => {
    try {
        // Extract all event data sent from frontend
        const formData = req.body;

        // Create a new Event document using spread operator
        const newEvent = new Event({
            ...formData
        });

        // If event object is successfully created
        if (newEvent) {
            // Save event to database
            await newEvent.save();

            // Send success response
            res.status(201).json({
                message: "New Event Created",
            });
        } 
        // If event creation fails due to invalid data
        else {
            res.status(400).json({ message: "Invalid Event Details" });
        }

    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ===================== GET CURRENT / UPCOMING EVENTS =====================
export const getCurrentEvent = async (req, res) => {
    try {
        // Fetch events whose date is greater than current date (upcoming events)
        const events = await Event.find({
            date: { $gt: new Date() }
        }).sort({ date: 1 }); // Sort events by nearest date first

        // If events exist, return them
        if (events) {
            res.status(200).json({ currEvents: events });
        } 
        // If no upcoming events exist
        else {
            res.status(200).json({ currEvents: null });
        }
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ===================== GET ALL EVENTS WITH PAGINATION (ADMIN) =====================
export const getAllEvent = async (req, res) => {
    // Pagination logic to fetch events in pages (10 events per page)
    try {
        // Get page number from query params (default = 1)
        const page = parseInt(req.query.page) || 1;

        // Set fixed limit per page
        const limit = 10; // FIXED TO 10

        // Calculate number of documents to skip
        const skip = (page - 1) * limit;

        // Get total number of events
        const totalEvents = await Event.countDocuments();

        // Fetch paginated events sorted by date
        const events = await Event.find()
            .sort({ date: 1 })
            .skip(skip)
            .limit(limit);

        // Send paginated response
        res.status(200).json({
            success: true,
            events,
            pagination: {
                totalEvents,
                totalPages: Math.ceil(totalEvents / limit),
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({
            message: "Failed to Fetch Events",
            error
        });
    }
};


// ===================== DELETE EVENT CONTROLLER =====================
export const deleteEvent = async (req, res) => {
    try {
        // Extract event ID from route parameters
        const e_id = req.params.id;

        // Delete event by ID
        const deletedEvent = await Event.findByIdAndDelete(e_id);

        // If event does not exist
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Send success response with deleted event
        res.json({ message: "Event deleted successfully", event: deletedEvent });

    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: "Error deleting event", error });
    }
};
