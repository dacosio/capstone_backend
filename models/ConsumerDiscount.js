const mongoose = require("mongoose");

const ConsumerDiscountSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    qrIdentification: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "removed", "canceled", "expired"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ConsumerDiscount", ConsumerDiscountSchema);
