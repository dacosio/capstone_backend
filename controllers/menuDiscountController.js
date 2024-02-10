const MenuDiscount = require("../models/MenuDiscount");

// after submitting the coupon created by merchant the discount id will be passed here including the menus selected where coupon was linked
const addMenuDiscount = async (req, res) => {
    try {
        const { discountId, menuIds } = req.body
        
        if(!discountId || !menuIds || !Array.isArray(menuIds)) {
            return res.status(400).json({ error: "Discoint id and menu id required"});
        }

        const menuDiscounts = menuIds.map((menuId) => ({
            discountId: discountId,
            menuId: menuId
        }))

        const newMenuDiscount = await MenuDiscount.create(menuDiscounts)

        res.status(200).json({ message: "Menu discount successfully created.", newMenuDiscount })
    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
} 

const getAllMenuDiscount = async (req, res) => {
    try {
        const merchantId = req.merchantId;

        if(!merchantId) {
            return res.status(400).json({ error: "Merchant not found" })
        }

        const menuDiscounts = await MenuDiscount.find()
            // wiil remove comment once we have the Menu table
            // .populate({
            //     path: "menuId",
            //     select: "name price",
            // })
            .populate({
                path: "discountId",
                select: "label percentDiscount"
            })
            .lean();

        if (!menuDiscounts?.length) {
            return res.status(400).json({ message: "No menu discounts found" });
        }

        res.status(200).json({menuDiscounts});

    } catch(error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports = {
    addMenuDiscount,
    getAllMenuDiscount,
}
