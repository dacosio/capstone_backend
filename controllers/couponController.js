const Coupon = require("../models/Coupon");
const Merchant = require("../models/Merchant");

const getAllCoupon = async(req, res) => {
    try {
        const merchantId = req.merchantId;

        if (!merchantId) {
            return res.status(400).json({ error: "Merchant not found" });
        }

        const coupons = await Coupon.find().lean()

        res.json({ coupons });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Something went wrong"})
    }
}

module.exports = {
    getAllCoupon,
}