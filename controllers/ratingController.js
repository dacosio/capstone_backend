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
    // Destructure rating details from request body
    const { rating, comment } = req.body;
    const { merchantId } = req.params;

    // Check if rating and merchantId are provided
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }
    //since the logged in user
    const consumerId = req.id;

    const newRating = await Rating.create({
      rating,
      comment,
      consumer: consumerId,
      merchant: merchantId,
    });

    // Respond with success message
    res.status(201).json({ message: "Rating added successfully", newRating });
  } catch (error) {
    // Handle any errors during rating creation
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllMerchantRatings,
  addRating,
};
