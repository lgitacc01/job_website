    import mongoose from "mongoose";

const RecommendSchema = new mongoose.Schema({
  userId: String,
  jobs: [String]
});

export default mongoose.model("Recommend", RecommendSchema);
