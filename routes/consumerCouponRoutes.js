const express = require("express");
const router = express.Router();
const consumerCouponController = require("../controllers/consumerCouponController");

router
  .route("/consumer-coupon")
  .get(consumerCouponController.getAllConsumerCoupons)
  .post(consumerCouponController.addConsumerCoupon)
  .put(consumerCouponController.updateConsumerCoupon);

module.exports = router;
