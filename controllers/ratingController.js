const Merchant = require("../models/Merchant");
const Rating = require("../models/Rating");
const Consumer = require("../models/Consumer");

const getAllMerchantRatings = async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ user: req.id })
      .populate({
        path: "user",
        select: "-password",
      })
      .lean();

    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found" });
    }

    // Find all ratings for the merchant and populate merchant and consumer fields
    const ratings = await Rating.find({ merchant: merchant._id })
      .populate({
        path: "merchant",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "consumer",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .lean();

    // Return the ratings
    res.json({ ratings });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { merchantId } = req.params;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }
    const newRating = await Rating.create({
      rating,
      comment,
      consumer: req.consumerId,
      merchant: merchantId,
    });

    res.status(201).json({ message: "Rating added successfully", newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllMerchantRatings,
  addRating,
};
