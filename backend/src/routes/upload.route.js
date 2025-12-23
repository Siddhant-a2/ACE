// Import Express framework to create router
import express from "express";

// Import middleware to protect routes (requires authenticated user)
import { protectRoute } from "../middlewares/auth.middleware.js";

// Import controller function to generate upload signature
import { getSignature } from "../controllers/upload.controller.js";


// Create an Express Router instance
const router = express.Router();


// ===================== UPLOAD ROUTES =====================

// Generate Cloudinary upload signature (protected route)
// Used by frontend before uploading images directly to Cloudinary
router.get("/signature", protectRoute, getSignature);


// Export router to be used in main app
export default router;
