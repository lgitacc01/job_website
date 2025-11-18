import express from "express";
import { getAllRecommends, createRecommend } from "../controllers/recommendController.js";

const router = express.Router();

router.get("/", getAllRecommends);
router.post("/", createRecommend);

export default router;
