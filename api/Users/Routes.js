const express = require("express");
const passport = require("passport");
const {
  signup,
  signin,
  forgotPassword,
  resetPassword,
} = require("./Controller");

// Create a mini express application
const router = express.Router();

router.post("/signup", signup);

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.put("/reset-password/:userId", resetPassword);
router.put("/forgot-password", forgotPassword);

module.exports = router;
