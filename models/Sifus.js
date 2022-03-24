const mongoose = require("mongoose");

const SifuSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  sifuprofile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
});

// Validators:

// username: { type: String, unique: true},
// password: {
//   type: String,
//   required: true,
//   validate: {
//     validator: (value) => {
//       return /^(?=.*[A-Z])(?=.*[!@#$&])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(
//         value
//       );
//     },
//     message: "PASSWORD",
//   },
// },
// email: {
//   type: String,
//   match: [
//     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//     "Please fill a valid email address",
//   ],
// },
// image: { type: String },
// mentorprofile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
// resetLink: {
//   data: String,
//   default: "",
// },
// });

module.exports = mongoose.model("SifuSchema", SifuSchema);
