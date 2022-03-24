const express = require("express");
const passport = require("passport");
const { signUp, signIn, getSifus } = require("./Controller");

// Create a mini express application
const router = express.Router();

router.post("/signup", signUp);

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signIn
);

router.get("/", getSifus);

router;

module.exports = router;
