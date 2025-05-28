const { default: mongoose } = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    // How much discount is applied
    discountValue: {
      type: Number,
      required: true,
    },

    // Criteria for eligibility
    minOrderAmount: Number,
    maxDiscountAmount: Number,

    // Association with service/category
    applicableSubcategoryIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    ],
    applicableServiceIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    ],

    // Usage limits
    usageLimit: Number, // total number of times this offer can be used globally
    usagePerUser: Number,

    validFrom: Date,
    validTill: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional: coupon code
    couponCode: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Offer", offerSchema);

// {
//     "title": "Welcome Offer",
//     "description": "Get 20% off on your first service",
//     "discountValue": 20,
//     "validFrom": "2025-05-01",
//     "validTill": "2025-06-30",
//     "usagePerUser": 1,
//     "isActive": true,
//      "couponCode": "CLEAN100"
//   }
