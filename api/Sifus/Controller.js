const Sifu = require("../../models/Sifus");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../config/keys");
const SifuProfiles = require("../../models/SifuProfiles");

const generateToken = (newSifu) => {
  const payload = {
    username: Sifu.username,
    id: newSifu.id,
    exp: Date.now() + JWT_EXPIRATION_MS,

    email: newSifu.email,
  };
  return jwt.sign(payload, JWT_SECRET);
};
exports.signUp = async (req, res, next) => {
  try {
    //STEP ONE: encrypt the password
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    }
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRound);
    req.body.password = hashedPassword;
    console.log(
      "🚀 ~ file: controller.js ~ line 23 ~ exports.signUp= ~ req.body",
      req.body
    );

    //STEP TWO: send the hash password
    const sifu = await Sifu.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    const profile = await SifuProfiles.create({
      sifuowner: sifu._id,
    });
    const profileAndSifu = profile + sifu;
    console.log(
      "🚀 ~ file: controller.js ~ line 43 ~ exports.signUp= ~ profileAndSifu",
      profileAndSifu
    );

    //STEP THREE:the data that I want to send to the sifu in the inside Token and create it
    const token = generateToken(profileAndSifu);
    //STEP FOUR: Show the Token
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  const token = generateToken(req.user);
  res.status(200).json({ token: token });
};

exports.getSifus = async (req, res, next) => {
  try {
    //this mothed take only what inside the ""
    const tripArray = await Sifus.find().populate("sifuowner");
    res.json(tripArray);
  } catch (err) {
    next(err);
  }
};

// const Sifu = require("../../models/Sifus");
// const SifuAccount = require("../../models/Sifus");
// const SifuSifuProfiles = require("../../models/SifuSifuProfiless");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const {
//   JWT_SECRET,
//   JWT_EXPIRATION,
//   RESET_PASSWORD_KEY,
//   CLIENT_URL,
// } = require("../../config/keys");
// const mailgun = require("mailgun-js");
// const DOMAIN = "sandbox6f885200a77b400abf77388f6c5bfeea.mailgun.org";
// const apiKey = "4b58b10b3104693d5a62aa423e19b876-1b237f8b-709dc076";
// const mg = mailgun({ apiKey: apiKey, domain: DOMAIN });
// const _ = require("lodash");
// const SifuSifus = require("../../models/Sifus");
// const SifuSifuProfiless = require("../../models/SifuSifuProfiless");

// const generateToken = (sifu) => {
//   const payload = {
//     _id: sifu._id,
//     sifuname: sifu.sifuname,
//     exp: Date.now() + JWT_EXPIRATION, // number in milliseconds
//   };

//   const token = jwt.sign(payload, JWT_SECRET);
//   return token;
// };

// exports.signup = async (req, res, next) => {
//   try {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
//     req.body.password = hashedPassword;

//     const newSifu = await Sifus.create(req.body);
//     console.log(
//       "🚀 ~ file: sifus.controller.js ~ line 26 ~ exports.signup= ~ newSifu",
//       newSifu
//     );
//     const newSifuSifuProfiles = await SifuSifuProfiless.create({
//       sifuowner: newSifu._id,
//     });
//     console.log(
//       "🚀 ~ file: sifus.controller.js ~ line 31 ~ exports.signup= ~ newSifuSifuProfiles",
//       newSifuSifuProfiles
//     );
//     const accountnew = await SifuAccount.create({
//       sifuprofile: newSifuSifuProfiles._id,
//       accountName: newSifu.sifuname,
//     });
//     await SifuSifuProfiles.findByIdAndUpdate(
//       { _id: newSifuSifuProfiles.id },
//       { $push: { account: accountnew._id } }
//     );
//     console.log(
//       "🚀 ~ file: sifus.controller.js ~ line 36 ~ exports.signup= ~ accountnew",
//       accountnew
//     );
//     const token = generateToken(newSifu);
//     res.status(201).json({ token });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.signin = (req, res, next) => {
//   // passport passed sifu through req.sifu
//   const token = generateToken(req.sifu);
//   res.json({ token });
// };

// exports.getSifus = async (req, res, next) => {
//   try {
//     //this mothed take only what inside the ""
//     const tripArray = await SifuSifus.find().populate("owner");
//     res.json(tripArray);
//   } catch (err) {
//     next(err);
//   }
// };
