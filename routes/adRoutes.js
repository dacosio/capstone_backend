const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController");

router.route("/ad").get(adController.getAllAds).post(adController.createAds);
router.route("/ad/generate-ad").post(adController.generateAdText);

module.exports = router;
