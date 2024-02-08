const mongoose = require("mongoose");

const MerchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    opening: {
      type: Date,
      required: true,
    },
    closing: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Merchant", MerchantSchema);
