const express = require("express");
const adminRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
const Admin = require("../models/users/Admin");
const jwt = require("jsonwebtoken");
const User = require("../models/users/User");
const Provider = require("../models/users/Provider");
const Category = require("../models/category offered/Category");
const Subcategory = require("../models/category offered/Subcategory");
const Service = require("../models/category offered/Service");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");

adminRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email invalid");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("password invalid");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.send("Admin Created");
  } catch (error) {}
});

adminRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email invalid");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("password invalid");
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Admin not valid");
    }
    console.log(admin);
    const decode = await bcrypt.compare(password, admin.password);
    if (!decode) {
      throw new Error("Password invalid");
    }
    console.log(decode);
    //Create JWT token
    const token = jwt.sign(
      { _id: admin._id, role: "admin" },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    //send with cookie
    res.cookie("token", token);
    res.send("Admin logged in");
  } catch (error) {
    res.send("Error: " + error);
  }
});

adminRouter.get(
  "/users",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find();
      if (!users) {
        throw new Error("no users");
      }
      res.json({ message: "User fetched successfully", data: users });
    } catch (error) {
      res.send("Error: " + error);
    }
  }
);

adminRouter.get(
  "/providers",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await Provider.find();
      if (!users) {
        throw new Error("no providers");
      }
      res.json({ message: "Providers fetched successfully", data: users });
    } catch (error) {
      res.send("Error: " + error);
    }
  }
);

adminRouter.patch(
  "/provider/approval/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const id = req.params.id;

      const provider = await Provider.findById(id);
      if (!provider) {
        return res.status(404).send("Provider not found");
      }

      provider.approval = !provider.approval; // toggle logic
      await provider.save();

      res.send(`Provider approval toggled to ${provider.approval}`);
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  }
);

adminRouter.post(
  "/category",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, iconUrl } = req.body;

      if (!validator.isURL(iconUrl)) {
        throw new Error("Invalid Url ");
      }

      const category = new Category({
        name,
        iconUrl,
      });
      await category.save();
      res.json({ message: "category added successfully" });
    } catch (error) {
      res.send("Error: " + error);
    }
  }
);

adminRouter.post(
  "/subcategory",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, categoryId } = req.body;

      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error("Category not valid");
      }
      const subcategory = new Subcategory({
        name,
        categoryId,
      });
      await subcategory.save();
      res.json({ message: "subcategory added successfully" });
    } catch (error) {
      res.send("Error: " + error);
    }
  }
);

adminRouter.post(
  "/service",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, subcategoryId, min_price, max_price, photo } = req.body;

      if (!validator.isURL(photo)) {
        throw new Error("Invalid Url ");
      }

      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        throw new Error("Subcategory not valid");
      }
      const service = new Service({
        name,
        subcategoryId,
        min_price,
        max_price,
        photo,
      });
      await service.save();
      res.json({ message: "service added successfully" });
    } catch (error) {
      res.send("Error: " + error);
    }
  }
);

module.exports = { adminRouter };
