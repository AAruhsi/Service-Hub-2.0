const express = require("express");
const { validateUserSignup } = require("../middleware/validateSignup");
const User = require("../models/users/User");
const bcrypt = require("bcrypt");
const Provider = require("../models/users/Provider");
const authRouter = express.Router();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const { validateProviderPassword } = require("../models/users/Provider");
const { validateUserPassword } = require("../models/users/User");
const { validatePatchRequest } = require("../middleware/validatePatchRequest");

authRouter.post("/signup/user", validateUserSignup, async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password, gender, address } =
      req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exists please log in ");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
      gender,
      address,
    });
    await newUser.save();
    res.status(200).json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in signup", error: error.message });
  }
});

authRouter.post("/signup/provider", validateUserSignup, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      gender,
      address,
      photo,
    } = req.body;

    if (!validator.isURL(photo)) {
      return res.status(400).send("Please Provide valid photo");
    }

    const user = await Provider.findOne({ email });
    if (user) {
      return res.send("Provider already Registered please login");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = new Provider({
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
      gender,
      address,
      photo,
      doj: Date.now(),
    });

    await newProvider.save();
    res.status(200).send("Service Provide registered successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = role === "provider" ? Provider : User;
    const user = await Model.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found please register first" });
    }
    const validPassword =
      role === "provider"
        ? await user.validateProviderPassword(password)
        : await user.validateUserPassword(password);

    if (validPassword) {
      //create JWT token
      const token =
        role === "provider"
          ? await user.getProviderJWT(role)
          : await user.getUserJWT(role);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      res.json({ message: "Login Successfull", data: user });
    } else {
      res.status(400).send({ message: "password Invalid" });
    }
  } catch (error) {
    res.status(400).send("Error" + error);
  }
});

authRouter.get(
  "/profile",
  authenticateJWT,
  authorizeRoles("admin", "user", "provider"),
  async (req, res) => {
    try {
      const data = req.userDoc;
      res.json({ message: "Cookies fetched and USer data sent", data: data });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(400).json({ message: "Logout failed: " + error.message });
  }
});
authRouter.patch("/forgotPassword/user", authenticateJWT, async (req, res) => {
  try {
    const user = req.user;
    user.password;
    res.json({ message: "Cookies fetched", data: user });
  } catch (error) {
    res.status(400).send(error);
  }
});
authRouter.patch(
  "/user-edit",
  authenticateJWT,
  authorizeRoles("user"),
  validatePatchRequest,
  async (req, res) => {
    try {
      const userID = req.userDoc._id;
      const updatedUser = await User.findByIdAndUpdate(
        userID,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!res) {
        res.status(404).json({ message: "User not Found" });
      }

      res.json({ message: "USer updated", data: updatedUser });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

module.exports = { authRouter };
