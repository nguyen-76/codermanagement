var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

var indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const { sendResponse, AppError } = require("./helpers/utils.js");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`DB connected ${process.env.MONGO_URI}`))
  .catch((err) => console.log(err));

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});
module.exports = app;
