import express from "express";
import { getAllApplications, createApplication,applyJob,getJobApply } from "../controllers/applicationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllApplications);
router.post("/", createApplication);
router.post("/apply", verifyToken, applyJob);
router.get("/applied", verifyToken, getJobApply);

export default router;
