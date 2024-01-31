const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const multer = require("multer");
const uuid = require("uuid").v4;

// router.use(verifyJWT);

router.route("/users").get(usersController.getAllUsers);

const upload = multer({ dest: "uploads/" });

// image is the file name coming from the fe
router
  .route("/upload")
  .post(upload.single("image"), usersController.uploadFile);

//multiple upload with the same key called image
//custom file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //specify where to send file to
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    //uuid-originalName for file name format as an example
    const { originalname } = file;
    cb(null, `${uuid()} - ${originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000, files: 5 }, //5MB max of five files each u
});
router
  .route("/upload-multi")
  .post(uploadMultiple.array("image"), usersController.uploadFile);

//multiple upload with different keys
const multiUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

router.route("/upload-multi-key").post(multiUpload, usersController.uploadFile);

module.exports = router;
