const express = require("express");
const connectDb = require("./database");
const sifuRoutes = require("./api/Sifus/Routes");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();
const {
  routerNotFound,
  logger,
  handleError,
} = require("./middleware/middleware");

app.use((req, res, next) => {
  console.log(`${req.method}://${req.get("host")}${req.originalUrl}`);
  next();
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
app.use(express.json());
app.use(logger);
app.use(cors());
//initializing passport for to check sign In
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/sifus", sifuRoutes);

//middleware
app.use("/media", express.static(path.join(__dirname, "media")));
app.use(routerNotFound);

//middleware hundel Errors
app.use(handleError);
connectDb();
app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
