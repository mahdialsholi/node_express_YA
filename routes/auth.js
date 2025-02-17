const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler"); // handle async errors
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  UserModel,
  validateRegisterUser,
  validateUpdateUser,
  validateLoginUser,
} = require("../models/User");

// register user
/**
 * @route   /api/auth/register
 * @desc    Register  a new user
 * @method   POST
 * @access  Public
 */

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await UserModel.findOne({
      email: req.body.email,
    }); // check if user already exists
    if (user) return res.status(400).send("User already registered.");
    const salt = await bcrypt.genSalt(10); // generate salt
    req.body.password = await bcrypt.hash(req.body.password, salt); // hash password
    user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }); // create new user
    const _user = await user.save(); // save user to database
    const token = _user.generateToken(); // generate token
    const { password, ...other } = _user._doc; // remove password from user object
    res.send({ ...other, token });
  })
);
//  login user
/**
 * @route   /api/auth/login
 * @desc    Login user
 * @method   POST
 * @access  Public
 */

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await UserModel.findOne({ email: req.body.email }); // check if user exists
    if (!user) return res.status(400).send("Invalid email or password.");
    const isValidPassword = await bcrypt.compare(
      req.body.password, // client password
      user.password // database password
    );
    // if password is invalid
    if (!isValidPassword)
      return res.status(400).send("Invalid email or password.");
    const token = user.generateToken(); // generate token
    const { password, ...other } = user._doc; // remove password from user object
    res.status(200).send({ ...other, token });
  })
);

module.exports = router;
