const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");
const logger = require("./middlewares/logger");
const Joi = require("joi");
app.set("view engine", "ejs");// set the view engine to ejs 
app.use(cors()); // Use this after the variable declaration
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded 
const { connectDB } = require("./config/db");

connectDB(); // connect to the database

app.use(logger); // middleware
 

const { notFound, errorHandler } = require("./middlewares/errors");

app.use("/api/books", require("./routes/books")); // note app.use is used to use the middleware
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/password", require("./routes/password"));

// not found middleware
app.use(notFound);

// error handling middleware after the routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
