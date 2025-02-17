const express = require("express");
const { getForgetPassword } = require("../controllers/passwordCotroller");
const router = express.Router();

router.route("/forget-password").get(getForgetPassword);

module.exports = router;
