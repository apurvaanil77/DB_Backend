require("dotenv").config();
const express = require("express");
const cors = require("cors");

const reviewRouter = require("./src/routers/review");
const { reviewsDB } = require("./connections/mongo.init");
const constants = require("./constants");

const app = express();
const PORT = process.env.PORT;

let corsAllowedDomain = function (req, callback) {
  let corsOptions = {
    origin: "*",
    credentials: true,
    maxAge: 86400,
    allowedHeaders: constants.allowedHeaders,
    exposedHeaders: constants.exposedHeaders,
  };

  corsOptions = {
    origin: true,
    credentials: true,
  };

  callback(null, corsOptions);
};

const setCORS = cors(corsAllowedDomain);

app.use(function (req, res, next) {
  if (req.header(constants.SKIP_CORS_HEADER) !== "true") {
    setCORS(req, res, next);
  } else {
    next();
  }
});

app.use(express.json());
app.use(reviewRouter);

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
