const express = require("express");
const router = express.Router(); //

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

// router.get("/", getAllBooks);
// router.get("/:id", getSingleBook);
// router.post("/", verifyTokenAndAdmin, createBook);
// router.put("/:id", verifyTokenAndAdmin, updateBook);
// router.delete("/:id", verifyTokenAndAdmin, deleteBook);

// chain the routes

//  /api/books
router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createBook);

// /api/books/:id
router
  .route("/:id")
  .get(getSingleBook)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;
