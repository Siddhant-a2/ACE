// Import Express framework to create router
import express from "express";

// Import admin authorization middleware
import { adminPrivilage } from "../middlewares/auth.middleware.js";

// Import event-related controller functions
import {
    addEvent,
    deleteEvent,
    getCurrentEvent,
    getAllEvent,
    editEvent
} from "../controllers/event.controller.js"; 


// Create an Express Router instance
const router = express.Router();


// ===================== EVENT MANAGEMENT ROUTES =====================

// Add a new event (admin-only access)
router.post("/add-event", adminPrivilage, addEvent);

// Edit an existing event (admin-only)
router.put("/edit-event/:id", adminPrivilage, editEvent);


// Get the currently active/upcoming event (public access)
router.get("/get-curr-event", getCurrentEvent);

// Get all events (admin-only access, includes past events)
router.get("/get-all-event", adminPrivilage, getAllEvent);

// Delete an event by ID (admin-only access)
router.delete("/delete-event/:id", adminPrivilage, deleteEvent);


// Export router to be used in main app
export default router;
