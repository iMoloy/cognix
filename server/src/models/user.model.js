import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    photoURL: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "creator", "admin"],
      default: "user",
    },
    subscription: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
