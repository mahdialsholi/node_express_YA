const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/usersController");

router.get("/", verifyTokenAndAdmin, getAllUsers);

// /api/users/:id
router
  .route("/:id")
  .put(verifyTokenAndAuthorize, updateUser)
  .get(verifyTokenAndAuthorize, getUserById)
  .delete(verifyTokenAndAuthorize, deleteUserById);

module.exports = router;
