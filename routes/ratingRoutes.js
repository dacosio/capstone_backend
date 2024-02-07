const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");

router.route("/rating").get(ratingController.getAllMerchantRatings);

module.exports = router;
