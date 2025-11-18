import express from "express";
import { getAllJobs, createJob } from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", createJob);

export default router;
