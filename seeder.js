const { BookModel } = require("./models/Books");
const AuthorModel = require("./models/Author");

const { books, authors } = require("./data");
const { connectDB } = require("./config/db");
require("dotenv").config();

// Connect to MongoDB
connectDB();

// Seed the database
const importBooks = async () => {
  try {
    await BookModel.insertMany(books);
    console.log("All Books are added");
    process.exit(0); // 0 means exit without failure
  } catch (err) {
    console.log(err.message);
    process.exit(1); // 1 means exit with failure
  }
};

// Delete the data

const removeBooks = async () => {
  try {
    await BookModel.deleteMany();
    console.log("All Books are deleted");
    process.exit(0); // 0 means exit without failure
  } catch (err) {
    console.log(err.message);
    process.exit(1); // 1 means exit with failure
  }
};

// Seed the database
const importAuthors = async () => {
  try {
    await AuthorModel.insertMany(authors);
    console.log("All Author are added");
    process.exit(0); // 0 means exit without failure
  } catch (err) {
    console.log(err.message);
    process.exit(1); // 1 means exit with failure
  }
};

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
} else if (process.argv[2] === "-import-authors") {
  importAuthors();
} else {
  console.log("Please pass the correct arguments");
  process.exit(1);
}
