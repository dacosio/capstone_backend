const QRCode = require("qrcode");

const generateBase64QRCode = async (data) => {
  try {
    const qrData = JSON.stringify(data);
    const qrCodeBuffer = await QRCode.toBuffer(qrData);
    const base64QRCode = qrCodeBuffer.toString("base64");
    return base64QRCode;
  } catch (error) {
    console.error("Error generating Base64 QR code:", error);
    throw error;
  }
};

module.exports = {
  generateBase64QRCode,
};

//SAMPLE USAGE

/*
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
*/
