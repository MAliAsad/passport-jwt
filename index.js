const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("./passportConfig");

const user = require("./models/user");

// Initializing app and port

const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(express.json());

// Conecting with DB

const url =
  "mongodb+srv://admin:admin@cluster0.bj83a.mongodb.net/formDB?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("connected to mongoDB"));

// login route

app.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) throw err;
    if (!user) {
      res.status(500).send(info.message);
    } else {
      const payload = {
        username: user.username,
        email: user.email,
        sub: `${user._id}`,
      };
      const options = {
        subject: `${user._id}`,
        expiresIn: 900,
      };

      const token = jwt.sign(payload, "secret123", options);
      res.json({ token });
    }
  })(req, res, next);
});

// Listening to port

app.get(
  "/",
  passport.authenticate("jwt", { session: false }, (req, res) => {
    res.status(200).send("Successfully running");
  })
);

app.listen(port, () => console.log("Server is running on port: " + port));
