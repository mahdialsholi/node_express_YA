const express = require("express");
const {
  getForgetPassword,
  sendForgetPasswordLink,
  getResetPasswordView,
  resetThePassword,
} = require("../controllers/passwordCotroller");
const router = express.Router();
// /password/forget-password
router
  .route("/forget-password")
  .get(getForgetPassword)
  .post(sendForgetPasswordLink);

// /password/reset-password/:userId/:token
router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordView)
  .post(resetThePassword);

module.exports = router;
