import express from "express";
import { getCurrentUser, updateUserAvatar, updateUsername, logout } from "../../controllers/UserController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/user/me", isAuthenticated, getCurrentUser);
router.patch("/user/avatar", isAuthenticated, updateUserAvatar);
router.patch("/user/username", isAuthenticated, updateUsername);
router.post("/user/logout", isAuthenticated, logout);

export default router;
