const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
    .route("/discount")
    .post(discountController.addDiscount)
    .get(discountController.getAllDiscount);

router.route("/active-discount").get(discountController.getAllActiveDiscount);

router.route("/discount/:id").get(discountController.getDiscount);

module.exports = router;
