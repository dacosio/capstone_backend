const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
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
            // required: true,
        },
        validFrom: {
            type: Date,
            required: true,
        },
        validTo: {
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

module.exports = mongoose.model("Discount", DiscountSchema)