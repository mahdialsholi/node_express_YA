const express = require("express");
const router = express.Router(); //
const {
  BookModel,
  validateBook,
  validateUpdateBook,
} = require("../models/Books");
const asyncHandler = require("express-async-handler"); // handle async errors
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

/*
 * @desc Get all books
 * @route GET /api/books
 * method: GET
 * @access Public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // console.log("====", req.query);
    const { minPrice, maxPrice } = req.query;
    let books;
    if (minPrice && maxPrice) {
      books = await BookModel.find({
        price: { $gte: minPrice, $lte: maxPrice },
      }).populate("author", " -_id -createdAt -updatedAt -__v");
      res.status(200).json({ books });
    } else {
      books = await BookModel.find().populate(
        "author",
        " -_id -createdAt -updatedAt -__v"
      );
      res.status(200).json({ books });
    }
  })
);

/*
 * @desc Get a single book
 * @route GET /api/books/:id
 * method: GET
 * @access Public
 */

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await BookModel.findById(id).populate(
      "author",
      " -_id -__v -createdAt -updatedAt -image   "
    );
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json({ book });
  })
);

/*
 * @desc Create a book
 * @route POST /api/books
 * method: POST
 * @access protected route for admin
 */
router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    const book = new BookModel(req.body);
    const data = await book.save();
    res.status(201).json({ data });
  })
);

/*
 * @desc Update a book
 * @route PUT /api/books/:id
 * method: PUT
 * @access protected route for admin
 */

router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error } = validateUpdateBook(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    const book = await BookModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json({ book });
  })
);

/*
 * @desc Delete a book
 * @route DELETE /api/books/:id
 * method: DELETE
 * @access protected route for admin
 */
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await BookModel.findByIdAndDelete(id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.status(200).json({ message: "Book deleted successfully" });
  })
);

module.exports = router;
