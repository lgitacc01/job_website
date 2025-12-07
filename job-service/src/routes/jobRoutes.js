import express from "express";
import { getAllJobs, createJob ,searchJobs} from "../controllers/jobController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllJobs);
router.get("/search", searchJobs);
router.post("/", verifyToken, createJob);


export default router;
