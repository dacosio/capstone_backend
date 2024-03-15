const express = require("express");
const router = express.Router();
const consumerDiscountController = require("../controllers/consumerDiscountController");

router
    .route("/consumer-discounts")
    .post(consumerDiscountController.addConsumerDiscount)
    .put(consumerDiscountController.updateConsumerDiscount);
    
router
    .route("/consumer-discounts/:id")
    .get(consumerDiscountController.getConsumerDiscount);

router
    .route("/consumer-discounts/merchant")
    .get(consumerDiscountController.getConsumerDiscountsByMerchant);

module.exports = router;
