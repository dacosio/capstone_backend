const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const multer = require("multer");

// router.use(verifyJWT);
const upload = multer({ dest: "uploads/" });

router.route("/users").get(usersController.getAllUsers);
// image is the file name coming from the fe
router
  .route("/upload")
  .post(upload.single("image"), usersController.uploadFile);

module.exports = router;
