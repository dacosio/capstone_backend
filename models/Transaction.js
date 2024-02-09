const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    consumerCouponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConsumerCoupon",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
