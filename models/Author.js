const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    nationality: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
      maxlength: 255,
    },
    image: {
      type: String,
      default: "https://avatar.iran.liara.run/public/43",
    },
  },
  { timestamps: true }
);

const AuthorModel = model("Author", authorSchema);

module.exports = AuthorModel;
