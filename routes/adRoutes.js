const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController");

router.route("/ad").get(adController.getAllAds).post(adController.createAds);
router.route("/ad/generate-ad").post(adController.generateAdText);
router
    .route("/ad/price")
    .get(adController.getAdPrices)
    .post(adController.createAdPrices);
module.exports = router;
