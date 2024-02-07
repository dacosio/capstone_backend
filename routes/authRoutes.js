const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.register);

router.route("/change-password").put(authController.changePassword);

router.route("/login").post(authController.login);

router.route("/refresh").post(authController.refresh);

router.route("/logout").post(authController.logout);

router.route("/merchant").post(authController.addMerchant);
router.route("/consumer").post(authController.addConsumer);

module.exports = router;
