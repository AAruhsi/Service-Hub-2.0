const mongoose = require("mongoose");

const providerAvailableSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider", // Reference to the service provider
      required: true, // Assuming the sp_id is required
    },
    availability: {
      type: Map,
      of: {
        morning: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
        night: { type: Boolean, default: false },
      },
      required: true,
    },
  },
  { timestamps: true }
);

// {
//     "employeeId": "60f7b79e82f34a3f3c34d2ab",
//     "availability": {
//       "Monday":   { "morning": true,  "evening": false, "night": false },
//       "Tuesday":  { "morning": false, "evening": true,  "night": false },
//       "Wednesday": { "morning": true, "evening": false, "night": true }
//     }
//   }

module.exports = mongoose.model(
  "ProviderAvailability",
  providerAvailableSchema
);
