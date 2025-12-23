// Import jsonwebtoken to create and sign JWT tokens
import jwt from "jsonwebtoken";

// Utility function to generate JWT token and attach it to response cookies
export const generateToken = (userId, res) => {

    // Create JWT token containing userId as payload
    const token = jwt.sign(
        { userId },                       // Payload
        process.env.JWT_SECRET,           // Secret key for signing
        {
            expiresIn: "7d",              // Token expiration time
        }
    );

    // Store JWT token in HTTP-only cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,   // Cookie expiration (7 days)
        httpOnly: true,                   // Prevent access via JavaScript (XSS protection)
        sameSite: "strict",               // Prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development" // Use HTTPS in production
    });

    // Return generated token (useful for testing or API responses)
    return token;
};
