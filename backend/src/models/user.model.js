import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    email: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
      default: "",   // URL of profile picture
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    batch: {
      type: String,   // Example: "2020", "2024", etc.
      default: "",
    },

    fullName: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
