import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: String,
  jobId: String,
  status: {
    type: String,
    default: "pending"
  }
});

export default mongoose.model("Application", ApplicationSchema);
