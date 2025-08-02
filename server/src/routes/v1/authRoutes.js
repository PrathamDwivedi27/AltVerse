// routes/authRoutes.js
import express from "express";
import passport from "passport";

const router = express.Router();

// Start Google login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after Google login
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "http://localhost:4000", // Change based on frontend
  })
);

export default router;
