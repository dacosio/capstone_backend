const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router
  .route("/transaction")
  .get(transactionController.getAllTransactions)
  .post(transactionController.addTransaction);

module.exports = router;
