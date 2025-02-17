const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");
const logger = require("./middlewares/logger");
const Joi = require("joi");

const helmet = require("helmet"); // for security headers
app.use(helmet()); // Use this after the variable declaration

app.set("view engine", "ejs"); // set the view engine to ejs
app.use(
  cors({
    origin: "http://localhost:3000",
  })
); // Use this after the variable declaration
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
const { connectDB } = require("./config/db");
const path = require("path");

connectDB(); // connect to the database

app.use(logger); // middleware

app.use(express.static(path.join(__dirname, "images"))); // serve static files

const { notFound, errorHandler } = require("./middlewares/errors");

app.use("/api/books", require("./routes/books")); // note app.use is used to use the middleware
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/password", require("./routes/password"));

// not found middleware
app.use(notFound);

// error handling middleware after the routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
