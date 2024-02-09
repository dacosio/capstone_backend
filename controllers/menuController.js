const Menu = require("./../models/Menu");
const jwt = require("jsonwebtoken");


// const checkEmail = async (email) => {
//     const check = await User.findOne({ email }).lean().exec();

//     if (check) {
//         return res.status(400).json({
//             message:
//                 "The email address already exists, try with a different email address.",
//         });
//     }
// }


// Get all menu item

const getAllMenu = async (req, res) => {
    try {
        // checkEmail();
        // const allMenuItems = await Menu.find();

        console.log(req.user)

        // if (!allMenuItems?.length) {
        //     return res.status(400).json({ message: "No menu available" });
        // }

        res.status(200).json({ success: true, data: [] });

        // res.status(200).json({ success: true, data: allMenuItems });

    } catch (error) {
        console.error('Error getting all menu items:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



// add new menu item

const addMenuItem = async (req, res) => {
    try {

        // checkEmail();
        const {
            itemImage,
            itemName,
            originalPrice,
            itemDescription,
            merchantId,
            cuisineTypeId,
            isAvailable,
            couponId
        } = req.body;

        const newMenuItem = new Menu({
            itemImage,
            itemName,
            originalPrice,
            itemDescription,
            merchantId,
            cuisineTypeId,
            isAvailable,
            couponId
        });

        const savedMenuItem = await newMenuItem.save();

        res.status(201).json({ success: true, data: savedMenuItem });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


// delete menu item

const deleteMenuItem = async (req, res) => {
    try {

        checkEmail();
        const { id } = req.params;

        const deletedMenuItem = await Menu.findByIdAndDelete(id);
        if (!deletedMenuItem) {
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }

        res.status(200).json({ success: true, message: 'Menu item deleted successfully' });

    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


module.exports = {
    getAllMenu,
    addMenuItem,
    deleteMenuItem
};