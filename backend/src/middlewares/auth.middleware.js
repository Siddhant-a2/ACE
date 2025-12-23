// Import jsonwebtoken to verify and decode JWT tokens
import jwt from "jsonwebtoken";

// Import User model to fetch user details from database
import User from "../models/user.model.js";


// ===================== AUTHENTICATION MIDDLEWARE =====================

// Middleware to protect routes (only accessible to logged-in users)
export const protectRoute = async (req, res, next) => {
    try {
        // Extract JWT token from cookies
        const token = req.cookies.jwt;

        // If no token exists, user is not authenticated
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If token verification fails
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }   

        // Fetch user from database using decoded userId
        // Exclude password field for security reasons
        const user = await User.findById(decoded.userId).select("-password");

        // If user does not exist in database
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach authenticated user data to request object
        req.user = user;

        // Pass control to next middleware or controller
        next();

    } catch (error) {
        // Log error for debugging
        console.log("Error in protectRoute middleware: ", error);

        // Send generic server error response
        res.status(500).json({ message: "Internal server error" });
    }
};


// ===================== ADMIN AUTHORIZATION MIDDLEWARE =====================

// Middleware to allow access only to admin users
export const adminPrivilage = async (req, res, next) => {
    try {
        // Extract JWT token from cookies
        const token = req.cookies.jwt;

        // If no token exists, user is not authenticated
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If token verification fails
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // Fetch user from database using decoded userId
        // Exclude password field for security reasons
        const user = await User.findById(decoded.userId).select("-password");
        
        // If user does not exist in database
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has admin privileges
        if (!user.isAdmin) {
            return res.status(404).json({ message: "Unauthorized to perform this operation" });
        }

        // Attach admin user data to request object
        req.user = user;

        // Pass control to next middleware or controller
        next();
        
    } catch (error) {
        // Log error for debugging
        console.log("Error in adminPrivilage middleware: ", error);

        // Send generic server error response
        res.status(500).json({ message: "Internal server error" });
    }
};
