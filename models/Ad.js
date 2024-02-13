const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },
        template: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
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
);

module.exports = mongoose.model("Ad", AdSchema);
