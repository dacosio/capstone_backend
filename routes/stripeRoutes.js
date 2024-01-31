const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/stripe-customer").post(stripeController.createCustomer);
router.route("/stripe-card").post(stripeController.addNewCardToCustomer);
module.exports = router;
