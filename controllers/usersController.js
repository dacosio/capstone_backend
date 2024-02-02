const { s3UploadV3 } = require("../aws/s3");
const User = require("../models/User");
const { generateBase64QRCode } = require("../helpers/generateBase64QRCode");

const getAllUsers = async (req, res) => {
  try {
    // lean will only save us a json data without other functions like .save() etc...
    const users = await User.find().select("-password").lean();

    const base64QRCode = await generateBase64QRCode(users);
    console.log(base64QRCode); //save the qr to users coupon purchase

    if (!users?.length) {
      return res.status(400).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//sample uplaod controller
const uploadFile = async (req, res) => {
  try {
    const results = await s3UploadV3(req.files);
    res.json({ status: "success", results });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getAllUsers,
  uploadFile,
};
