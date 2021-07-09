const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const user = require("./models/user");

let options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken;
options.secretOrKey = "secret123";

passport.use(
  new localStrategy((username, password, done) => {
    user.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);
        if (!result) {
          return done(null, false, { message: "Incorrect password" });
        } else {
          return done(null, result);
        }
      });
    });
  })
);

passport.use(
  new jwtStrategy(options, (jwtPayload, done) => {
    user.findById({ _id: jwtPayload.sub }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    });
  })
);
