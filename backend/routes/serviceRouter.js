const express = require("express");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const Category = require("../models/category offered/Category");
const Subcategory = require("../models/category offered/Subcategory");
const Service = require("../models/category offered/Service");

const serviceRouter = express.Router();

serviceRouter.get(
  "/category",
  authenticateJWT,
  authorizeRoles("admin", "provider", "user"),
  async (req, res) => {
    try {
      const category = await Category.find();
      if (!category) {
        res.send("No Category available");
      }
      res.json({ message: "Category fetched Successfully", data: category });
    } catch (error) {
      res.send("error: " + error);
    }
  }
);
serviceRouter.get(
  "/subcategory",
  authenticateJWT,
  authorizeRoles("admin", "provider", "user"),
  async (req, res) => {
    try {
      const subcategory = await Subcategory.find();
      if (!subcategory) {
        res.send("No Category available");
      }
      res.json({ message: "Sub fetched Successfully", data: subcategory });
    } catch (error) {
      res.send("error: " + error);
    }
  }
);
serviceRouter.get(
  "/service",
  authenticateJWT,
  authorizeRoles("admin", "provider", "user"),
  async (req, res) => {
    try {
      const service = await Service.find();
      if (!service) {
        res.send("No service available");
      }
      res.json({ message: "service fetched Successfully", data: service });
    } catch (error) {
      res.send("error: " + error);
    }
  }
);

serviceRouter.patch(
  "/category",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, _id, iconUrl, isActive } = req.body;

      // 1. Validate _id
      if (!_id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // 2. Validate update fields
      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (iconUrl !== undefined) updateFields.iconUrl = iconUrl;
      if (isActive !== undefined) updateFields.isActive = isActive;

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
      }

      // 3. Check if category exists
      const category = await Category.findById(_id);
      if (!category) {
        return res.status(404).json({ error: "No Category available" });
      }

      // 4. Perform update
      const updatedCategory = await Category.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true }
      );

      res.status(200).json({
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = { serviceRouter };
