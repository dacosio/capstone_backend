const mongoose = require("mongoose");

const CouponStatus = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CouponStatus", CouponStatus);
