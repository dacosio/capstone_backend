const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        orginalPrice: {
            type: String,
        },
        description: {
            type: String,
        },
        merchantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            required: true,
        },
        cuisineTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CuisineType",
            required: true,
        },
        isFeatured: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Menu", MenuSchema);
