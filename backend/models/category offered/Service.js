const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: String,
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
  min_price: {
    type: Number,
    required: true,
    min: 100,
  },
  max_price: {
    type: Number,
    required: true,
    max: 99999.99,
  },
  photo: {
    type: String,
    required: true,
  },
  iconPublicId: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Service", serviceSchema);
