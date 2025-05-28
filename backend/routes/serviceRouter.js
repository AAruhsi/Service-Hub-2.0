const express = require("express");
const validator = require("validator");
const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const Category = require("../models/category offered/Category");
const Subcategory = require("../models/category offered/Subcategory");
const Service = require("../models/category offered/Service");
const {
  toggleSoftDeleteCategory,
  togglesSoftDeleteSubcategory,
} = require("../utils/categoryUtil");

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
      const { name, _id, iconUrl } = req.body;

      // 1. Validate _id
      if (!_id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // 2. Validate update fields
      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (iconUrl !== undefined) updateFields.iconUrl = iconUrl;

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

serviceRouter.patch(
  "/subcategory",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      //cannot change category ID you need to delete it and make a new subcategory if you need to change
      const { name, _id } = req.body;
      // 1. Validate _id
      if (!_id) {
        return res.status(400).json({ error: "ID is required" });
      }
      // 2. Validate update fields

      if (name !== undefined)
        return res.status(400).json({ error: "Nothing to update" });

      // 3. Check if category exists
      const subcategory = await Subcategory.findById(_id);
      if (!subcategory) {
        return res.status(404).json({ error: "No Subategory available" });
      }

      subcategory.name = name;
      await subcategory.save();
      res.status(200).json({
        message: "SubCategory updated successfully",
        data: subcategory,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

serviceRouter.patch(
  "/service",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, _id, photo, min_price, max_price, isActive } = req.body;

      // 1. Validate _id
      if (!_id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // 2. Validate update fields
      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (photo !== undefined) updateFields.photo = photo;
      if (min_price !== undefined) updateFields.min_price = min_price;
      if (max_price !== undefined) updateFields.max_price = max_price;
      if (isActive !== undefined) updateFields.isActive = isActive;

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
      }

      // 3. Check if category exists
      const service = await Service.findById(_id);
      if (!service) {
        return res.status(404).json({ error: "No service available" });
      }

      // 4. Perform update
      const updatedservice = await Service.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true }
      );

      res.status(200).json({
        message: "Service updated successfully",
        data: updatedservice,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

serviceRouter.post(
  "/toggle-category",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    const { categoryId } = req.body;

    try {
      await toggleSoftDeleteCategory(categoryId, isActive);
      res.send("Category soft-deleted and cascade triggered.");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

serviceRouter.post(
  "/toggle-subcategory",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    const { _id, isActive } = req.body;
    const subcategoryId = _id;
    try {
      await togglesSoftDeleteSubcategory(subcategoryId, isActive);
      res.send("Category soft-deleted and cascade triggered.");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

serviceRouter.post(
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

serviceRouter.post(
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

serviceRouter.post(
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

module.exports = { serviceRouter };
