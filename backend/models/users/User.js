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
      type: String,
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

//schema methods
userSchema.methods.getUserJWT = async function (role) {
  const token = await jwt.sign({ _id: this._id, role }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validateUserPassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};
module.exports = mongoose.model("User", userSchema);
