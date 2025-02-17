 const e = require("express");
const { Schema, model } = require("mongoose");
const Joi = require("joi");

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    author: {
      type: Schema.Types.ObjectId, // this is a reference to the Author model
      required: true,
      ref: "Author", // this is the model to which we are referring
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft", "hard"],
      trim: true,
    },
  },
  { timestamps: true }
);

function validateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(20).required(),
    description: Joi.string().trim().min(10).required(),
    price: Joi.number().min(1).required(),
    author: Joi.string().required(),
    cover: Joi.string().required(),
  });
  return schema.validate(obj);
}

function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(20),
    description: Joi.string().trim().min(10),
    price: Joi.number().min(1),
    author: Joi.string(),
    cover: Joi.string(),
  });
  return schema.validate(obj);
}

const BookModel = model("Book", bookSchema);
module.exports = {
  BookModel,
  validateBook,
  validateUpdateBook,
};
