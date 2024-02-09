const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/menu-all").get(menuController.getAllMenu);
router.route("/menu-add").post(menuController.addMenuItem);
router.route("/menu-delete").delete(menuController.deleteMenuItem);

module.exports = router;