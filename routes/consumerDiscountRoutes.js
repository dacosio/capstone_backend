const express = require("express");
const router = express.Router();
const consumerDiscountController = require("../controllers/consumerDiscountController");

router
  .route("/consumer-discount")
  .get(consumerDiscountController.getAllConsumerDiscounts)
  .post(consumerDiscountController.addConsumerDiscount)
  .put(consumerDiscountController.updateConsumerDiscount);

module.exports = router;
