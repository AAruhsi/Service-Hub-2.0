// listeners/categoryListeners.js
const eventEmitter = require("../utils/eventEmitter");
const Subcategory = require("../models/category offered/Subcategory");
const Service = require("../models/category offered/Service");
const notifyAdmins = require("../utils/notifyAdmin");

eventEmitter.on("categoryDeleted", async ({ categoryId, isActive }) => {
  try {
    // Soft-delete all subcategories
    await Subcategory.updateMany(
      { categoryId },
      {
        isActive: isActive,
      }
    );

    // Find affected subcategory IDs
    const subcategories = await Subcategory.find({ categoryId });
    const subIds = subcategories.map((sub) => sub._id);

    // Soft-delete all services under those subcategories
    await Service.updateMany(
      { subcategoryId: { $in: subIds } },
      {
        isActive: isActive,
      }
    );

    // Notify admin dashboards
    notifyAdmins(`Category ${categoryId} was soft-deleted`);
  } catch (err) {
    console.error("Error handling categoryDeleted event:", err);
  }
});

eventEmitter.on("subcategoryDeleted", async ({ subcategoryId, isActive }) => {
  try {
    await Service.updateMany(
      { subcategoryId: { $in: subcategoryId } },
      {
        isActive: isActive,
      }
    );
    // Notify admin dashboards
    notifyAdmins(`Category ${subcategoryId} was toggled to ${isActive} `);
  } catch (error) {
    console.error("Error handling categoryDeleted event:", err);
  }
});
