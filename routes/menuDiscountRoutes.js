const express = require("express");
const router = express.Router();

const menuDiscountController = require("../controllers/menuDiscountController");

router
    .route("/menu-discount")
    .post(menuDiscountController.addMenuDiscount)
    .get(menuDiscountController.getAllMenuDiscount);

router
    .route("/menu-discounts/merchant")
    .get(menuDiscountController.getMenuDiscountsByMerchant);

module.exports = router;
