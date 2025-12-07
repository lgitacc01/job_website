import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  job_id: Number,                 // nếu muốn auto thì bỏ field này
  job_title: String,
  closed_date: Date,
  salary: Number,
  area: String,
  experience: String,
  degree: String,
  post_user_id: Number,
  description: String,
  requirements: String,
  benefits: String
}, { timestamps: true });

export default mongoose.model("Job", JobSchema,"job");
