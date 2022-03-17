const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

const User = require("../models/User");

const { JWT_SECRET } = require("../config/keys");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });

    const passwordsMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (passwordsMatch) return done(null, user);

    return done(null, false); // throw a 401 error

    // if (user) {
    //   // validate password
    //   const passwordsMatch = await bcrypt.compare(password, user.password);
    //   if (passwordsMatch) {
    //     // if correct, we pass into the controller
    //     return done(null, user);
    //   } else {
    //     // if password incorrect, we throw a 401 error
    //     return done(null, error);
    //   }
    // } else {
    //   return done(null, false); // throw a 401 error
    // }
  } catch (error) {
    done(error);
  }
});
exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    console.log("🚀 ~ file: passport.js ~ line 46 ~ payload", payload);
    if (Date.now() > payload.exp) {
      // if the token is expired
      return done(null, false); // throw a 401 error
    }
    try {
      const user = await User.findById(payload._id);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);
