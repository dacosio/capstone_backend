const dotenv = require("dotenv");
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

// comment
const cors = require("cors");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const multer = require("multer");
const morgan = require("morgan");
dotenv.config();
const PORT = process.env.PORT || 8000;
connectDB();
app.use(logger);
app.use(cors());

// gives the ability to process json data from the frontend
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
// this is to make the public static file accessible globally, ex. public/css/style.css can be called with css/styles.css
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/stripeRoutes"));
app.use("/api", require("./routes/ratingRoutes"));

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File is too large",
            });
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                message: "File limit reached.",
            });
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "File must be an image.",
            });
        }
    }
});
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});
// this middleware will catch whenever our routes/controllers has an error
app.use(errorHandler);

// this is executed once when the connection is successful
mongoose.connection.once("open", () => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// this is executed once when an error occurs
mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        "mongoErrLog.log"
    );
});

module.exports = app;
