const  asyncHandler  = require("express-async-handler");


/**
 * @desc   Reset password
 * @route   /password/forget-password
 * @access  Public
 * @method    POST
 */


// /password/forget-password
const getForgetPassword = asyncHandler((req, res) => {
  res.render( "forget-password");
});

module.exports = { getForgetPassword };
