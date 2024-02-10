const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
    .route("/menu")
    .get(menuController.getAllMenu)
    .post(menuController.addMenuItem)

router.route("/menu/:id")
    .delete(menuController.deleteMenuItem);

module.exports = router;