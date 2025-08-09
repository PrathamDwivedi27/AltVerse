// routes/authRoutes.js
import express from "express";
import { createEvent } from "../../controllers/EventController.js";

const router = express.Router();

router.post('/event',createEvent);

export default router;
