const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");


router
    .route("/discount")
    .post(discountController.addDiscount);
    
module.exports = router;