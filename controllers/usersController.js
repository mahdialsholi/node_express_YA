const asyncHandler = require("express-async-handler"); // handle async errors
const bcrypt = require("bcrypt");

const { UserModel, validateUpdateUser } = require("../models/User");



/**
 * @desc Update user
 * @route PUT /api/users/:id
 * @access Private
 * @method PUT
 */
const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    },
    { new: true }
  ).select("-password");
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.send(user);
});

// Get All Users
/**
 * @desc  Get all users
 * @route  GET /api/users
 * @access Private (admin)
 * @method  GET
 */

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
});

// Get user by id
/**
 * @desc  Get user by id
 * @route  GET /api/users/:id
 * @access Private (admin or user)
 * @method  GET
 */

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).send("User not found");
  }
});

// Delete user by id
/**
 * @desc Delete user by id
 * @route  DELETE /api/users/:id
 * @access Private (admin or user)
 * @method  DELETE
 */

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (user) {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User has been deleted" });
  } else {
    return res.status(404).send("User not found");
  }
});

module.exports = { updateUser, getAllUsers, getUserById, deleteUserById };
