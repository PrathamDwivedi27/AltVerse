import { Router } from "express";
import userRoutes from "./v1/userRoutes.js";
import authRoutes from "./v1/authRoutes.js";
import universeRoutes from "./v1/universeRoutes.js";
import messageRoutes from "./v1/messageRoutes.js";
import eventRoutes from "./v1/eventRoutes.js";

const router= Router();
router.use("/v1", userRoutes);
router.use("/v1", authRoutes);
router.use("/v1", universeRoutes);
router.use("/v1", messageRoutes);
router.use("/v1", eventRoutes);


export default router;