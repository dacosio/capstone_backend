const { s3UploadV3 } = require("../aws/s3");
const Consumer = require("../models/Consumer");
const Merchant = require("../models/Merchant");

const getAllConsumers = async (req, res) => {
    try {
        const consumers = await Consumer.find()
            .populate({
                path: "user",
                select: "-password",
            })
            .lean();

        if (!consumers?.length) {
            return res.status(200).json({ message: "No consumers found" });
        }

        res.status(200).json(consumers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllMerchants = async (req, res) => {
    try {
        const merchants = await Merchant.find()
            .populate({
                path: "user",
                select: "-password",
            })
            .lean();

        if (!merchants?.length) {
            return res.status(200).json({ message: "No merchants found" });
        }

        res.status(200).json(merchants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// sample uplaod controller
const uploadFile = async (req, res) => {
    try {
        const results = await s3UploadV3(req.files);
        res.json({ status: "success", results });
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

module.exports = {
    getAllConsumers,
    getAllMerchants,
    uploadFile,
};
