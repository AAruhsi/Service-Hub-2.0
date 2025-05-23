const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  iconUrl: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Category", categorySchema);
