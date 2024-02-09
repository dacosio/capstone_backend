const mongoose = require("mongoose");

const ConsumerCouponSchema = new mongoose.Schema(
  {
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "removed", "expired"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ConsumerCoupon", ConsumerCouponSchema);
