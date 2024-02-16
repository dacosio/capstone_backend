const { s3UploadV3 } = require("../aws/s3");
const User = require("../models/User");
const Consumer = require("../models/Consumer");
const Merchant = require("../models/Merchant");

const getUser = async (req, res) => {
    try {
        const userId = req.id;

        if (!userId) {
            return res
                .status(404)
                .json({ error: "User not found. Please log in" });
        }

        const user = await User.findOne(
            { _id: userId },
            { password: 0 }
        ).lean();

        if (!user) {
            return res.status(200).json({ message: "No user found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const updateImage = async (req, res) => {
    try {
        const userId = req.id;

        if (!userId) {
            return res
                .status(404)
                .json({ error: "User not found. Please log in" });
        }

        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: "image is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: { image },
        }).exec();

        if (updatedUser) {
            res.status(200).json({
                message: `Image for the user has been updated to ${image}`,
            });
        } else {
            res.status(400).json({
                message: `Image for the user has not been updated to ${image}`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// sample uplaod controller
const uploadFile = async (req, res) => {
    try {
        console.log(req.files);
        const results = await s3UploadV3(req.files);
        res.json({ status: "success", results });
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

module.exports = {
    getUser,
    getAllConsumers,
    getAllMerchants,
    updateImage,
    uploadFile,
};
