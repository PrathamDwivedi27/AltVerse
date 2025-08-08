import express from "express";
import {
  createUniverse,
  getMyUniverses,
  deleteUniverse,
  updateUniverseTitle,
  generateInviteLink,
  redeemInviteLink,
  kickParticipant
} from "../../controllers/UniverseController.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/universe", isAuthenticated, createUniverse);
router.get("/universe/my", isAuthenticated, getMyUniverses);
router.delete("/universe/:id", isAuthenticated, deleteUniverse);
router.patch("/universe/:id/title", isAuthenticated, updateUniverseTitle);

router.get("/universe/:id/invite", isAuthenticated, generateInviteLink );
router.post("/universe/redeem-invite", isAuthenticated, redeemInviteLink);

router.post("/universe/:id/kick", isAuthenticated, kickParticipant);

export default router;
