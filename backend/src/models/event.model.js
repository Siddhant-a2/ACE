// Import mongoose to define schema and interact with MongoDB
import mongoose from "mongoose";

// Define Event schema structure
const eventSchema = new mongoose.Schema(
    {
        // Stores which layout is selected for the event (Layout1, Layout2, etc.)
        layoutSelected: {
            type: String,
            required: true,
        },

        // Date and time of the event
        date: {
            type: Date,
            required: true,
        },

        // Title of the event
        title: {
            type: String,
            required: true,
        },

        // Background image URL
        BGImage: {
            type: String,
            default: "",
        },

        // Toggle to determine if background image should be shown
        BGImageCheck: {
            type: Boolean,
            default: false,
        },

        // First foreground image URL
        FGImage1: {
            type: String,
            default: "",
        },

        // Toggle to enable/disable first foreground image
        FGImage1Check: {
            type: Boolean,
            default: false,
        },

        // Second foreground image URL
        FGImage2: {
            type: String,
            default: "",
        },

        // Toggle to enable/disable second foreground image
        FGImage2Check: {
            type: Boolean,
            default: false,
        },

        // Primary heading text
        Heading1: {
            type: String,
            default: "",
        },

        // Toggle to enable/disable primary heading
        Heading1Check: {
            type: Boolean,
            default: false,
        },

        // Secondary heading text
        Heading2: {
            type: String,
            default: "",
        },

        // Toggle to enable/disable secondary heading
        Heading2Check: {
            type: Boolean,
            default: false,
        },

        // Description or paragraph content of the event
        Paragraph: {
            type: String,
            default: "",
        },

        // Toggle to enable/disable paragraph display
        ParagraphCheck: {
            type: Boolean,
            default: false,
        },

        // Toggle to enable/disable CTA button
        ctaTextCheck: {
            type: Boolean,
            default: false,
        },

        // Call-to-action button text (e.g., Register Now)
        ctaText: {
            type: String,
            default: ""
        },

        // External registration link for the event
        registrationLink: {
            type: String,
            default: "",
        }
    },
    {
        // Automatically adds createdAt and updatedAt timestamps
        timestamps: true
    }
);

// Create Event model using the schema
const Event = mongoose.model("Event", eventSchema);

// Export Event model for use in controllers
export default Event;
