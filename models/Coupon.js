const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        percentDiscount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        validFromDate: {
            type: Date,
            required: true,
        },
        validToDate: {
            type: Date,
            required: true,
        },
        validFromTime: {
            type: Date,
            required: true
        },
        validToTime: {
            type: Date,
            required: true,
        }, 
        merchantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Coupon", CouponSchema)