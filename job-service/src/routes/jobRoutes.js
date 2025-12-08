import express from "express";
import { getAllJobs, createJob ,searchJobs,getRandomJobs} from "../controllers/jobController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllJobs);
router.get("/search", verifyToken, searchJobs);
router.post("/", verifyToken, createJob);

router.get('/random', getRandomJobs);
export default router;
