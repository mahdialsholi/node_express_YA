const asyncHandler = require("express-async-handler");
const AuthorModel = require("../models/Author");
const {} = require("../models/Author");

const {
  BookModel,
  validateBook,
  validateUpdateBook,
} = require("../models/Author");

/*
 * @desc Get all authors
 * @route GET /api/authors
 * method: GET
 * @access Public
 */
const getAllAuthors = asyncHandler(async (req, res) => {
  // const authors = await AuthorModel.find().sort({ createdAt: -1 });// sort by createdAt in descending order
  // const authors = await AuthorModel.find().sort({ firstName: -1 });   // sort by firstName in ascending order
  // const authors = await AuthorModel.find().sort({ firstName: 1 });   // sort by firstName in descending order
  // const authors = await AuthorModel.find().sort({ firstName: 1 }).select("firstName lastName");   // sort by firstName in descending order and select only firstName and lastName
  // const authors = await AuthorModel.find().sort({ firstName: 1 }).select("firstName lastName -_id");   // sort by firstName in descending order and select only firstName and lastName and exclude _id
  const { pageNumber } = req.query;
  const authorsPerPage = 2;
  const authors = await AuthorModel.find()
    .skip((pageNumber - 1) * authorsPerPage)
    .limit(authorsPerPage); // skip the first 2 authors and return the next 2 authors
  res.status(200).json({ authors, count: authors.length });
  // no need to return here, because we are using asyncHandler
});

/*
 * @desc Get a single author
 * @route GET /api/authors/:id
 * method: GET
 * @access Public
 */
const getSingleAuthor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const author = await AuthorModel.findById(id);
  if (!author) {
    res.status(404).json({ message: "Author not found" });
    return;
  }
  res.status(200).json({ author });
});

/*
 * @desc Create an author
 * @route POST /api/authors
 * method: POST
 * @access protected (only admin can create an author)
 */

const createAuthor =  asyncHandler(async (req, res) => {
    const author = new AuthorModel(req.body);
    if (!author) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }
    const data = await author.save();
    res.status(201).json({
      data,
      message: "Author created successfully",
    });
  })
/*
 * @desc Update an author
 * @route PUT /api/authors/:id
 * method: PUT
 * @access protected (only admin can update an author)
 */

const updateAuthor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const author = await AuthorModel.findByIdAndUpdate(
    id,
    // {
    //   $set: {
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     nationality: req.body.nationality,
    //     image: req.body.image,
    //   },
    // }, // update only the fields that are provided
    req.body, // update all fields
    { new: true } // return the updated document
  );
  if (!author) {
    res.status(404).json({ message: "Author not found" });
    return;
  }

  res.status(200).json({
    author,
    message: "Author updated successfully",
  });
});


/*
 * @desc Delete an author
 * @route DELETE /api/authors/:id
 * method: DELETE
 * @access protected (only admin can delete an author)
 */

const deleteAuthor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const author = await AuthorModel.findByIdAndDelete(id);
  if (!author) {
    res.status(404).json({ message: "Author not found" });
    return;
  }
  res.status(200).json({ message: "Author deleted successfully" });
});

module.exports = {
  getAllAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
