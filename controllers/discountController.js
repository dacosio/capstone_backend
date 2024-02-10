const Discount = require("../models/Discount");

const addDiscount = async(req, res) => {
    try {
        const merchantId = req.merchantId;
        const { label, description, percentDiscount, validFrom, validTo } = req.body;

        if(!merchantId) {
            return res.status(400).json({ error: "Merchant not found" })
        }

        if(!label || !description || !percentDiscount || !validFrom || !validTo) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newDiscount = await Discount.create({
            label, 
            description, 
            percentDiscount, 
            validFrom, 
            validTo,
            merchantId: merchantId,
        });

        res.status(200).json({ message: "Discount created successfullly.", discountId: newDiscount._id });

    } catch(error) {
        console.error(error)
        res.status(500).json({ error: "Discount not created."})
    }
}

module.exports = {
    addDiscount,
}