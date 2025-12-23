import express from "express";
import { getAllUsers, createUser,login,refreshToken ,register} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/register", register);
router.post("/login", login);
router.post('/refresh-token', refreshToken);

export default router;
