
const logger = (req, res, next) => {
  // middleware
  // arrange in importance
  console.log("Time: ", Date.now());
  next();
};

module.exports = logger;
