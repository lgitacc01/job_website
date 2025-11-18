import express from "express";
import { getAllApplications, createApplication } from "../controllers/applicationController.js";

const router = express.Router();

router.get("/", getAllApplications);
router.post("/", createApplication);

export default router;
