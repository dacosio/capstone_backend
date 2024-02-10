const mongoose = require("mongoose");

const MenuDiscountSchema = new mongoose.Schema (
    {
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        },
        discountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Discount",
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("MenuDiscount", MenuDiscountSchema)
