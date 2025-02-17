const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      console.log("req.user", req.user);
      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
  } else {
    return res.status(401).send("Access Denied");
  }
}

// verifyToken and authorize user
function verifyTokenAndAuthorize(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .send("You are not allowed to do this operation, token not match with id");
    }
  });
}
// 


function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    console.log("req.use=====r", req.user);
    console.log("req.user.isAdmin", req.user.isAdmin);
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .send(
          "You are not allowed to do this operation ,only admin can do this operation"
        );
    }
  });
}

module.exports = { verifyToken, verifyTokenAndAuthorize, verifyTokenAndAdmin };
