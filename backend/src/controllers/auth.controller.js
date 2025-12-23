// Import User model to interact with users collection
import User from "../models/user.model.js";

// Import bcrypt for hashing and comparing passwords
import bcrypt from "bcryptjs";

// Import utility function to generate JWT token
import { generateToken } from "../libs/utils.js";


// ===================== SIGNUP CONTROLLER =====================
export const signup = async (req, res) => {
    // Extract required fields from request body
    const { username, fullName, password, email, batch } = req.body;

    try {
        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Enforce minimum password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if username already exists
        const user = await User.findOne({ username });

        if (user) return res.status(400).json({ message: "username already exists" });

        // Generate salt for hashing password
        const salt = await bcrypt.genSalt(10);

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user instance
        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email,
            fullName: fullName,
            batch: batch,
        });

        // Save new user to database
        if (newUser) {
            await newUser.save();
            res.status(201).json({
                message: "New profile created",
                user: newUser,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        // Handle unexpected errors
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ===================== LOGIN CONTROLLER =====================
export const login = async (req, res) => {
    // Extract login credentials
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username: username });

        // If user does not exist
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentails" });
        }

        // Compare entered password with stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token and attach to cookie
        generateToken(user._id, res);

        // Send authenticated user data
        res.status(200).json({
            user: user,
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ===================== LOGOUT CONTROLLER =====================
export const logout = async (req, res) => {
    try {
        // Clear JWT cookie
        res.cookie("jwt", "", { maxAge: 0 });

        res.status(200).json({ message: "logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ===================== UPDATE PROFILE (ADMIN) =====================
export const updateProfileByAdmin = async (req, res) => {
    try {
        // Extract fields admin is allowed to update
        const { fullName, username, email, batch, isAdmin } = req.body;

        // Update user using user ID from params
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                fullName: fullName,
                username: username,
                email: email,
                batch: batch,
                isAdmin: isAdmin,
            },
            { new: true }
        ).select("-password");

        // If user not found
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return updated user data
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error });
    }
};


// ===================== UPDATE PROFILE (SELF) =====================
export const updateProfile = async (req, res) => {
    try {
        // Extract updatable fields
        const {
            username,
            fullName,
            email,
            password,
            confirmPassword,
            batch,
            profilePic,
            isAdmin
        } = req.body;

        // Get logged-in user ID
        const userId = req.user._id;

        // Check if logged-in user is admin
        const admin = req.user.isAdmin;

        // ===================== ADMIN SELF UPDATE =====================
        if (admin) {
            // If password is not being updated
            if (password.length == 0) {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        username: username,
                        fullName: fullName,
                        email: email,
                        profilePic: profilePic,
                        batch: batch,
                        isAdmin: isAdmin
                    },
                    { new: true }
                );
                res.status(200).json({ user: updatedUser });
            } 
            // If password is updated
            else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        username: username,
                        fullName: fullName,
                        email: email,
                        profilePic: profilePic,
                        batch: batch,
                        isAdmin: isAdmin,
                        password: hashedPassword,
                    },
                    { new: true }
                );

                // Regenerate token after password update
                generateToken(userId, res);
                res.status(200).json({ user: updatedUser });
            }
        }

        // ===================== NORMAL USER UPDATE =====================
        else {
            // Update only profile picture
            if (password.length == 0) {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        profilePic: profilePic,
                    },
                    { new: true }
                );
                res.status(200).json({ user: updatedUser });
            } 
            // Update password and profile picture
            else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        profilePic: profilePic,
                        password: hashedPassword,
                    },
                    { new: true }
                );

                // Regenerate token after password change
                generateToken(user._id, res);
                res.status(200).json({ user: updatedUser });
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


// ===================== AUTH CHECK =====================
export const checkAuth = (req, res) => {
    try {
        // Return authenticated user attached by middleware
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ===================== GET ALL USERS (ADMIN) =====================
export const getAllUsers = async (req, res) => {
    // Extract query parameters with defaults
    const { search = "", batch = "all", page = 1, limit = 8 } = req.query;

    // Base search query using regex for username
    const query = {
        username: { $regex: search, $options: "i" },
    };

    // Filter by batch if provided
    if (batch !== "all") {
        query.batch = batch;
    }

    try {
        // Count total matching users
        const total = await User.countDocuments(query);

        // Fetch paginated users
        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ===================== GET SINGLE USER =====================
export const getSingleUser = async (req, res) => {
    try {
        // Find user by ID
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to Fetch User", error });
    }
};


// ===================== DELETE USER =====================
export const deleteUser = async (req, res) => {
    try {
        // Get user ID from route params
        const userId = req.params.id;

        // Delete user from database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to Delete User", error });
    }
};
