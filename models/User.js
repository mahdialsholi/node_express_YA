const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    username: {
      type: String,
      required: true,

      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// generate a token
// not  arrow function because we need to use this keyword
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  ); // generate token 
};

const validateRegisterUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email().trim(),
    username: Joi.string().min(5).max(255).required().trim(),
    password: Joi.string().trim().required(),
  });
  return schema.validate(user);
};

const validateLoginUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email().trim(),
    password: Joi.string().trim().required(),
  });
  return schema.validate(user);
};

const validateUpdateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().trim(),
    username: Joi.string().min(5).max(255).trim(),
    password: Joi.string().trim(),
  });
  return schema.validate(user);
};

const UserModel = model("User", UserSchema);
module.exports = {
  UserModel,
  validateRegisterUser,
  validateUpdateUser,
  validateLoginUser,
};
