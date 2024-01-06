const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.register);

router.route("/forgot-password").put(authController.forgotPassword);

router.route("/login").post(authController.login);

router.route("/refresh").post(authController.refresh);

router.route("/logout").post(authController.logout);

module.exports = router;
