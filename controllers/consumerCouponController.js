const ConsumerCoupon = require("../models/ConsumerCoupon");

const getAllConsumerCoupons = async (req, res) => {
  try {
    const consumerId = req.consumerId;

    if (!consumerId) {
      return res.status(404).json({ error: "Consumer not found" });
    }

    // Find all consumerCoupons for the consumer and populate consumer and coupon fields
    const consumerCoupons = await ConsumerCoupon.find({ consumer: consumerId })
      .populate({
        path: "consumer",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "coupon",
        populate: {
          path: "merchant",
          populate: {
            path: "user",
            select: "-password",
          },
        },
      })
      .lean();

    // Return the consumerCoupons
    res.json({ consumerCoupons: consumerCoupons });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addConsumerCoupon = async (req, res) => {
  try {
    const consumerId = req.consumerId;

    const { couponId } = req.body;

    const newConsumerCoupon = await ConsumerCoupon.create({
      consumer: consumerId,
      coupon: couponId,
      qrCode: "",
      qrIdentification: "",
      status: "active",
    });

    res.status(201).json({
      message: "ConsumerCoupon added successfully",
      newConsumerCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllConsumerCoupons,
  addConsumerCoupon,
};
