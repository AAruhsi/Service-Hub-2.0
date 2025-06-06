const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary.js");
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

const upload = multer({ storage: multer.memoryStorage() });
const { uploadToCloudinary } = require("../middleware/uploadToCloudinary");

const serviceRouter = express.Router();

serviceRouter.get("/category", async (req, res) => {
  try {
    const category = await Category.find();
    if (!category) {
      res.send("No Category available");
    }
    res.json({ message: "Category fetched Successfully", data: category });
  } catch (error) {
    res.send("error: " + error);
  }
});
serviceRouter.get(
  "/subcategory",
  authenticateJWT,
  authorizeRoles("admin", "provider", "user"),
  async (req, res) => {
    try {
      const subcategory = await Subcategory.find().populate("categoryId");
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
      const service = await Service.find().populate({
        path: "subcategoryId",
        populate: {
          path: "categoryId",
        },
      });
      if (!service) {
        res.send("No service available");
      }
      res.json({ message: "service fetched Successfully", data: service });
    } catch (error) {
      res.send("error: " + error);
    }
  }
);

//get subcategory of catgeory :id
serviceRouter.get(
  "/subcategory/:id",
  authenticateJWT,
  authorizeRoles("admin", "user", "provider"),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) res.status(401).send("Id needed");
      const subcategories = await Subcategory.find({ categoryId: id });
      res.json({ message: "Subcatgeorie received", data: subcategories });
    } catch (error) {
      res.status(400).send("Erro fetcheing dataa of subcatgeories");
    }
  }
);

//get service of catgeory :id
serviceRouter.get(
  "/service/:categoryId",
  authenticateJWT,
  authorizeRoles("admin", "user", "provider"),
  async (req, res) => {
    try {
      const { categoryId } = req.params;
      if (!categoryId) res.status(401).send("Id needed");
      const subcategories = await Subcategory.find({
        categoryId: categoryId,
      }).select("_id");

      const services = await Service.find({
        subcategoryId: { $in: subcategories.map((s) => s._id) },
      }).limit(100); // Always use limits in production APIs
      res.json({ message: "services received", data: services });
    } catch (error) {
      res.status(400).send("Erro fetcheing dataa of subcatgeories");
    }
  }
);

//update category
serviceRouter.patch(
  "/category/:categoryId",
  authenticateJWT,
  authorizeRoles("admin"),
  upload.single("iconUrl"),
  async (req, res) => {
    try {
      const { name } = req.body;
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.status(400).json({ error: "ID is required" });
      }

      const updateFields = {};
      if (name !== undefined) updateFields.name = name;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "No Category available" });
      }

      if (req.file) {
        // 🔁 Delete old image if it exists
        if (category.iconPublicId) {
          await cloudinary.uploader.destroy(category.iconPublicId);
        }

        // 📤 Upload new image
        const result = await uploadToCloudinary(req.file.buffer, "categories");

        updateFields.iconUrl = result.secure_url;
        updateFields.iconPublicId = result.public_id;
      }

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
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

//update subcategory
serviceRouter.patch(
  "/subcategory/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      //cannot change category ID you need to delete it and make a new subcategory if you need to change
      const { name } = req.body;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      if (name == undefined)
        return res.status(400).json({ error: "Nothing to update" });

      const subcategory = await Subcategory.findByIdAndUpdate(
        id,
        { name: name },
        { new: true }
      );

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
  "/service/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, min_price, max_price, isActive } = req.body;
      const { id } = req.params;
      // 1. Validate _id
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ error: "No service available" });
      }
      // 2. Validate update fields
      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (min_price !== undefined) updateFields.min_price = min_price;
      if (max_price !== undefined) updateFields.max_price = max_price;
      if (isActive !== undefined) updateFields.isActive = isActive;

      if (req.file) {
        // 🔁 Delete old image if it exists
        if (service.iconPublicId) {
          await cloudinary.uploader.destroy(service.iconPublicId);
        }

        // 📤 Upload new image
        const result = await uploadToCloudinary(req.file.buffer, "service");

        updateFields.photo = result.secure_url;
        updateFields.iconPublicId = result.public_id;
      }

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "Nothing to update" });
      }

      const updatedservice = await Service.findByIdAndUpdate(
        id,
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

//toggle is Active
serviceRouter.post(
  "/toggle-category",
  authenticateJWT,
  authorizeRoles("admin"),
  async (req, res) => {
    const { categoryId, isActive } = req.body;

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

//add category
serviceRouter.post(
  "/category",
  authenticateJWT,
  authorizeRoles("admin"),
  upload.single("iconUrl"),
  async (req, res) => {
    try {
      const { name } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const result = await uploadToCloudinary(req.file.buffer, "categories");
      console.log("RESULT: ", result);

      const category = new Category({
        name,
        iconUrl: result.secure_url,
        iconPublicId: result.public_id,
      });

      await category.save();
      res.json({ message: "Category added successfully", data: category });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).send("Error: " + error.message);
    }
  }
);

//add subcategory
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
      res.json({
        message: "subcategory added successfully",
        data: subcategory,
      });
    } catch (error) {
      res.send("Error: " + error);
    }
  }
);

//add service
serviceRouter.post(
  "/service",
  authenticateJWT,
  authorizeRoles("admin"),
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, subcategoryId, min_price, max_price } = req.body;

      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) {
        throw new Error("Subcategory not valid");
      }

      const result = await uploadToCloudinary(req.file.buffer, "service");
      const service = new Service({
        name,
        subcategoryId,
        min_price,
        max_price,
        photo: result.secure_url,
        iconPublicId: result.public_id,
      });
      await service.save();
      res.json({ message: "service added successfully", data: service });
    } catch (error) {
      res.send("Error: " + error);
    }
  }
);

module.exports = { serviceRouter };
