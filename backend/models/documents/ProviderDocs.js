const mongoose = require("mongoose");

const SpDocumentSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Documents",
  },
});

module.exports = mongoose.model("ProviderDocs", SpDocumentSchema);
