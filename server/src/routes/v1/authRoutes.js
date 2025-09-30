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
    failureRedirect: "http://localhost:3000",
    successRedirect: "http://localhost:3000/dashboard", // Change based on frontend
  })
);

// routes/authRoutes.js (or wherever you manage backend routes)

// ... your existing routes for /auth/google and /auth/google/callback

/**
 * @route   GET /api/auth/status
 * @desc    Check if user is authenticated and return user data
 * @access  Public
 */
router.get("/api/auth/status", (req, res) => {
  // req.isAuthenticated() is a Passport.js function that checks the session
  if (req.isAuthenticated()) {
    // Session is valid. Send back the user data.
    res.status(200).json(req.user);
  } else {
    // No valid session.
    res.status(401).json({ message: "Not authenticated" });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Log the user out
 * @access  Private
 */
router.post("/api/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // req.session.destroy() can be added for extra cleanup if needed
    res.status(200).json({ message: "Logout successful" });
  });
});

export default router;
