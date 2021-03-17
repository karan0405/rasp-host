// Default Packages.
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const config = require("./config");
const constants = require("./constants");
const hostRouter = require("./routes/host");
const authRouter = require("./routes/auth");
const fileOpsRouter = require("./routes/fileOps");
const utility = require("./utility");

const app = express();
const logger = constants.LOGGER;

// Initializing server monitoring
const statusMonitor = require("express-status-monitor")({
    path: "",
    healthChecks: [
        {
            protocol: "http",
            host: "localhost",
            port: 3000,
            path: "/health-check",
            headers: {},
        },
    ],
});
app.use(statusMonitor);
app.get("/status", [utility.checkAuthentication, utility.checkAuthorization], statusMonitor.pageRoute);

// Initializing User Schema
global.User = require("./models/user");

// DB Connection
mongoose.connect(
    config.dbConnectString,
    { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true },
    (err) => {
        if (err) {
            logger.error("DB Connection failed {err}", { err });
        } else {
            logger.info("DB Connection established");
        }
    }
);

// Initializing middlewares
app.use(cors());
app.use(fileUpload({ useTempFiles: true, tempFileDir: constants.TEMP_FOLDER_PATH }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check route
app.get("/health-check", (req, res) => {
    res.status(200).json({ success: "Connection established" });
});

// Handling routes
app.use("/", hostRouter);
app.use("/", authRouter);
app.use("/", fileOpsRouter);

// Catch 404 and forward to error handler.
app.use(function (req, res) {
    logger.warn(`404 Error Request - ${req.body}`);
    return res.status(404).json({ error: "URL does not exists" });
});

module.exports = app;
