const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
    {
        label: {
            type: String,
        },
        description: {
            type: String,
        },
        percentDiscount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        imageUrl: {
            type: String,
            // required: true,
        },
        validFromTime: {
            type: Date,
            required: true,
        },
        validToTime: {
            type: Date,
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
        merchant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Discount", DiscountSchema);
