const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
    {
        itemImage: {
            type: String,
            required: true,
        },
        itemName: {
            type: String,
            required: true,
        },
        orginalPrice: {
            type: String,
        },
        itemDescription: {
            type: String,
        },
        merchantId: {
            type: String,
        },
        cuisineTypeId: {
            type: String,
        },
        isFeatured: {
            type: boolean,
        },
        couponId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Menu", MenuSchema);
