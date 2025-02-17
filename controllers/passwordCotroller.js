const asyncHandler = require("express-async-handler");
const { UserModel, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

/**
 * @desc   Reset password
 * @route   /password/forget-password
 * @access  Public
 * @method    GET
 */

// /password/forget-password
const getForgetPassword = asyncHandler((req, res) => {
  res.render("forget-password");
});

/**
 * @desc   send email to reset password
 * @route   /password/forget-password
 * @access  Public
 * @method    POST
 */

// /password/forget-password
const sendForgetPasswordLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret, {
    expiresIn: "10m",
  });
  console.log("--", user._id);
  const link = `http://localhost:3000/password/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password Reset Link",
    html: `<h1>Click on the link to reset your password</h1><p>${link}</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "something went error" });
    } else {
      console.log("Email sent: " + info.response);
      res.render("link-send");
    }
  });
});

/**
 * @desc   get rest password page
 * @route   /password/reset-password/:userId/:token
 * @access  Public
 * @method   GET
 */

// /password/forget-password
const getResetPasswordView = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error" });
  }
});

/**
 * @desc    rest the password page
 * @route   /password/reset-password/:userId/:token
 * @access  Public
 * @method   POST
 */

// /password/forget-password
const resetThePassword = asyncHandler(async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await UserModel.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");
  } catch (err) {
    console.log(err);
    res.json({ message: "Error" });
  }
});

module.exports = {
  getForgetPassword,
  sendForgetPasswordLink,
  getResetPasswordView,
  resetThePassword,
};
