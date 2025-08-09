import express from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { createMessage,getMessagesForUniverse,editMessage,deleteMessage } from "../../controllers/MessageController.js";
import upload from "../../middlewares/multer.js";

const router = express.Router();

router.post("/universe/:universeId/message", isAuthenticated,upload.single("file"), createMessage);

router.get("/universe/:universeId/messages", isAuthenticated, getMessagesForUniverse);
router.patch("/message/:messageId", isAuthenticated, editMessage);
router.delete("/message/:messageId", isAuthenticated, deleteMessage);

export default router;
