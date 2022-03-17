const User = require("../../models/UserStudents");
const Account = require("../../models/Accounts");
const Profile = require("../../models/Profiles");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_EXPIRATION,
  RESET_PASSWORD_KEY,
  CLIENT_URL,
} = require("../../config/keys");
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox6f885200a77b400abf77388f6c5bfeea.mailgun.org";
const apiKey = "4b58b10b3104693d5a62aa423e19b876-1b237f8b-709dc076";
const mg = mailgun({ apiKey: apiKey, domain: DOMAIN });
const _ = require("lodash");

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    exp: Date.now() + JWT_EXPIRATION, // number in milliseconds
  };

  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);
    console.log(
      "🚀 ~ file: users.controller.js ~ line 26 ~ exports.signup= ~ newUser",
      newUser
    );
    const newProfile = await Profile.create({ owner: newUser._id });
    console.log(
      "🚀 ~ file: users.controller.js ~ line 31 ~ exports.signup= ~ newProfile",
      newProfile
    );
    const accountnew = await Account.create({
      profile: newProfile._id,
      balance: 100,
      accountName: newUser.username,
    });
    await Profile.findByIdAndUpdate(
      { _id: newProfile.id },
      { $push: { account: accountnew._id } }
    );
    console.log(
      "🚀 ~ file: users.controller.js ~ line 36 ~ exports.signup= ~ accountnew",
      accountnew
    );
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.signin = (req, res, next) => {
  // passport passed user through req.user
  const token = generateToken(req.user);
  res.json({ token });
};
