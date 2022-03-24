const mongoose = require("mongoose");

const SifuProfile = new mongoose.Schema({
  phonenumber: { type: String },
  profilepic: { type: String },
  linkedinlink: { type: String },
  instagramlink: { type: String },
  sifuowner: { type: mongoose.Schema.Types.ObjectId, ref: "SifuSchema" },
});

module.exports = mongoose.model("SifuProfile", SifuProfile);
