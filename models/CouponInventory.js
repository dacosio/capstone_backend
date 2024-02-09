const mongoose = require("mongoose");

const CouponInventorySchema = new mongoose.Schema(
    {
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    }
)