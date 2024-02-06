const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/stripe-customer")
  .post(stripeController.createCustomer)
  .get(stripeController.getCustomer);
router.route("/stripe-card").post(stripeController.addNewCardToCustomer);
router
  .route("/stripe-saved-cards")
  .get(stripeController.getCustomerPaymentMethods);
router.route("/stripe-charge-card").post(stripeController.chargeCard);

module.exports = router;
