import mongoose from "mongoose";
const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    topics: [{ name: String, available: Boolean }],
  });
  
  export const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", facultySchema);
  