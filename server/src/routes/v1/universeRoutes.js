import express from "express";
import {
  createUniverse,
  getMyUniverses,
  deleteUniverse,
  updateUniverseTitle,
} from "../../controllers/UniverseController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/universe", isAuthenticated, createUniverse);
router.get("/universe/my", isAuthenticated, getMyUniverses);
router.delete("/universe/:id", isAuthenticated, deleteUniverse);
router.patch("/universe/:id/title", isAuthenticated, updateUniverseTitle);

export default router;
