const mongoose = require("mongoose");
const validator = require("validator");

const providerSchema = new mongoose.Schema(
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
      required: true,
      maxlength: 10,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("The photo is not valid" + value);
        }
      },
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
    doj: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    avgRating: {
      type: Number,
      maxlength: 1,
    },
    approval: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", providerSchema);
