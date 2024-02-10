const Menu = require("./../models/Menu");

// Get all menu item

const getAllMenu = async (req, res) => {
    try {
        const merchantId = req.merchantId;

        const allMenuItems = await Menu.find({ merchantId });

        if (!allMenuItems?.length) {
            return res.status(400).json({ message: "No menu available" });
        }
        res.status(200).json({ success: true, data: allMenuItems });
    } catch (error) {
        console.error("Error getting all menu items:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

// add new menu item

const addMenuItem = async (req, res) => {
    try {
        const {
            imageUrl,
            name,
            originalPrice,
            description,
            cuisineTypeId,
            isFeatured,
        } = req.body;

        const merchantId = req.merchantId;

        const newMenuItem = new Menu({
            imageUrl,
            name,
            originalPrice,
            description,
            merchantId,
            cuisineTypeId,
            isFeatured,
        });

        const savedMenuItem = await newMenuItem.save();

        res.status(201).json({ success: true, data: savedMenuItem });
    } catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

// delete menu item

const deleteMenuItem = async (req, res) => {
    try {
        console.log(req);
        const { id } = req.params;

        const merchantId = req.merchantId;

        const deletedMenuItem = await Menu.findOneAndDelete({
            _id: id,
            merchantId,
        });

        if (!deletedMenuItem) {
            return res
                .status(404)
                .json({ success: false, error: "Menu item not found" });
        }

        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

module.exports = {
    getAllMenu,
    addMenuItem,
    deleteMenuItem,
};
