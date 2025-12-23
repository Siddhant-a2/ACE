// Import Express framework to create router
import express from "express";

// Import all authentication-related controller functions
import {
    checkAuth,
    deleteUser,
    login,
    logout,
    signup,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateProfileByAdmin
} from "../controllers/auth.controller.js";

// Import middleware for route protection and admin authorization
import { adminPrivilage, protectRoute } from "../middlewares/auth.middleware.js";


// Create an Express Router instance
const router = express.Router();


// ===================== AUTH ROUTES =====================

// Signup route (only accessible by admin to create users)
router.post("/signup", adminPrivilage, signup);

// Login route for users
router.post("/login", login);

// Logout route to clear authentication session/token
router.post("/logout", logout);


// ===================== PROFILE ROUTES =====================

// Update logged-in user's own profile (protected route)
router.put("/update-profile", protectRoute, updateProfile);

// Admin updates any user's profile using user ID
router.put("/admin/update/profile/:id", adminPrivilage, updateProfileByAdmin);


// ===================== AUTH CHECK ROUTES =====================

// Check if the user is authenticated (used on page reload)
router.get("/check-auth", protectRoute, checkAuth);


// ===================== USER MANAGEMENT (ADMIN) =====================

// Get all users (admin-only access)
router.get("/users", adminPrivilage, getAllUsers);

// Get a single user's details by ID (admin-only)
router.get("/admin/user/:id", adminPrivilage, getSingleUser);

// Delete a user by ID (admin-only)
router.delete("/delete-user/:id", adminPrivilage, deleteUser);


// Export router to be used in main app
export default router;
