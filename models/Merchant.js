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
        cuisineType: {
            type: String,
            enum: [
                "American",
                "Chinese",
                "Indian",
                "Italian",
                "Japanese",
                "Korean",
                "Mexican",
                "Thai",
                "Others",
            ],
            required: true,
        },
        cost: {
            type: String,
            enum: ["1", "2", "3", "4"],
            required: true,
        },
        // 7 items ["1970-01-01THH:mm:SSZ"]
        openings: {
            type: [Date],
            required: true,
        },
        // 7 items ["1970-01-01THH:mm:SSZ"]
        closings: {
            type: [Date],
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
