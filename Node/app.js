// Default Packages.
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const fileUpload = require("express-fileupload");
const config = require("./config");
const hostRouter = require("./routes/host");
const authRouter = require("./routes/auth");
const constants = require("./constants");
const logger = constants.LOGGER;
const app = express();

// Initializing User Schema
global.User = require("./models/user");

// DB Connection
mongoose.connect(config.dbConnectString, { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true },
  (err) => {
    if(err) {
      logger.error("DB Connection failed {err}", {err})
    } else {
      logger.info("DB Connection established")
    }
  }
);

// Initializing middlewares
app.use(cors());
app.use(fileUpload({useTempFiles: true, tempFileDir: constants.TEMP_FOLDER_PATH}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handling routes
app.use("/", hostRouter);
app.use("/", authRouter);

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
  logger.info(`404 Error Request - ${req.body}`);
  return res.status(404).json({"error": "URL does not exists"});
});


module.exports = app;
