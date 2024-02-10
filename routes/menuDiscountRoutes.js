const express = require("express");
const router = express.Router();

const menuDiscountController = require("../controllers/menuDiscountController");

router
    .route("/menuDiscount")
    .post(menuDiscountController.addMenuDiscount)
    .get(menuDiscountController.getAllMenuDiscount);
    
module.exports = router;