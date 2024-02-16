const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const uploadMulterToS3 = require("../middleware/uploadTos3");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/user").get(usersController.getUser);
router.route("/consumers").get(usersController.getAllConsumers);
router.route("/merchants").get(usersController.getAllMerchants);
router.route("/image").put(usersController.updateImage);

// V3 s3 sdk sample endpoint that uses upload
router
    .route("/upload-multi")
    .post(uploadMulterToS3.array("image"), usersController.uploadFile);
module.exports = router;
