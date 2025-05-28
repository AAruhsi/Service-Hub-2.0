const Category = require("../models/category offered/Category");
const Subcategory = require("../models/category offered/Subcategory");
const eventEmitter = require("./eventEmitter");

async function toggleSoftDeleteCategory(categoryId, isActive) {
  const category = await Category.findByIdAndUpdate(categoryId, {
    isActive: isActive,
  });

  if (!category) throw new Error("Category not found");

  // Emit event for cascading effects
  eventEmitter.emit("categoryDeleted", { categoryId, isActive });
}
async function togglesSoftDeleteSubcategory(subcategoryId, isActive) {
  const subcategory = await Subcategory.findByIdAndUpdate(subcategoryId, {
    isActive: isActive,
  });

  if (!subcategory) throw new Error("subcategory not found");

  // Emit event for cascading effects
  eventEmitter.emit("subcategoryDeleted", { subcategoryId, isActive });
}

module.exports = {
  toggleSoftDeleteCategory,
  togglesSoftDeleteSubcategory,
};
