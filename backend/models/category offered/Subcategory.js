const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    index: true,
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Subcategory", subcategorySchema);
