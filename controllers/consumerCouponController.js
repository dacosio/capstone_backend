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

    if (!consumerId) {
      return res.status(404).json({ error: "Consumer not found" });
    }

    const { couponId } = req.body;

    if (!couponId) {
      return res.status(400).json({ message: "CouponId is required" });
    }

    const newConsumerCoupon = await ConsumerCoupon.create({
      consumer: consumerId,
      coupon: couponId,
      qrCode: "qrCode",
      qrIdentification: "qrIdentification",
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

const updateConsumerCoupon = async (req, res) => {
  try {
    const { consumerCouponId, status } = req.body;

    if (
      !consumerCouponId ||
      !["active", "removed", "canceled", "expired"].includes(status)
    ) {
      return res
        .status(400)
        .json({ message: "consumerCouponId and status are required" });
    }

    const consumerCoupon = await ConsumerCoupon.findById(
      consumerCouponId
    ).exec();

    if (!consumerCoupon) {
      return res.status(400).json({ message: "ConsumerCoupon not found" });
    }

    consumerCoupon.status = status;

    const updatedConsumerCoupon = await consumerCoupon.save();

    if (updatedConsumerCoupon)
      res.status(200).json({ message: `Status for has been updated` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllConsumerCoupons,
  addConsumerCoupon,
  updateConsumerCoupon,
};
