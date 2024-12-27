import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  prn: { type: String, required: true, unique: true },
  dob: { type: String, required: true },
  firstChoice: { type: String, default: null },
  secondChoice: { type: String, default: null },
});

// Prevent overwriting of the model
export const User =
  mongoose.models.Userpbl || mongoose.model("Userpbl", userSchema);
