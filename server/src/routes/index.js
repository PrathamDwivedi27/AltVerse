import { Router } from "express";
import userRoutes from "./v1/userRoutes.js";
import authRoutes from "./v1/authRoutes.js";


const router= Router();
router.use("/v1", userRoutes);
router.use("/v1", authRoutes);


export default router;