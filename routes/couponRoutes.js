const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");


router
    .route("/coupon")
    .get(couponController.getAllCoupon);

module.exports = router;