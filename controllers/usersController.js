const { s3UploadV2 } = require("../aws/s3");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    // lean will only save us a json data without other functions like .save() etc...
    const users = await User.find().select("-password").lean();

    if (!users?.length) {
      return res.status(400).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const results = await s3UploadV2(req.files);
    console.log(results);
    res.json({ status: "success", results });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getAllUsers,
  uploadFile,
};
