const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");

router.route("/ratings/merchant").get(ratingController.getRatingsByMerchant);

router.route("/rating").post(ratingController.addRating);

module.exports = router;
