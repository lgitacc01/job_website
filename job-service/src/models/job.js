import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  company: String,
  salary: Number,
  location: String
});

export default mongoose.model("Job", JobSchema);
