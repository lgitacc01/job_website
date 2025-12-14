import express from "express";
import { getAllJobs, createJob ,searchJobs,getRandomJobs,getJobById,getJobsPagination} from "../controllers/jobController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/search", verifyToken, searchJobs);
router.post("/",verifyToken, createJob);

router.get('/random', getRandomJobs);
router.get('/pagination', getJobsPagination);
router.get("/:id",verifyToken, getJobById);
export default router;
