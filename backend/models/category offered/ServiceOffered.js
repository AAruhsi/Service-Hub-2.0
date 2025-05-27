const mongoose = require("mongoose");

const serviceOfferedSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("ServiceOffered", serviceOfferedSchema);
