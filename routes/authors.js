const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler"); // handle async errors
const Joi = require("joi");
const AuthorModel = require("../models/Author");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  getAllAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createAuthor);

router
  .route("/:id")
  .get(getSingleAuthor)
  .put(verifyTokenAndAdmin, updateAuthor)
  .delete(verifyTokenAndAdmin, deleteAuthor);

module.exports = router;
