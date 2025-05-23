const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("The email.is not valid" + value);
        }
      },
    },
    phoneNo: {
      type: Number,
      maxlength: 10,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} not supported for gender",
      },
      required: [true, "Gender is required"],
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
