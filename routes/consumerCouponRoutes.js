const express = require("express");
const router = express.Router();
const consumerCouponController = require("../controllers/consumerCouponController");

router
  .route("/consumerCoupon")
  .get(consumerCouponController.getAllConsumerCoupons)
  .post(consumerCouponController.addConsumerCoupon);

module.exports = router;
