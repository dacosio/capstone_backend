const ConsumerCoupon = require("../models/ConsumerCoupon");

const getAllConsumerCoupons = async (req, res) => {
  try {
    const consumerId = req.consumerId;

    if (!consumerId) {
      return res.status(404).json({ error: "Consumer not found" });
    }

    // Find all consumer coupons for the consumer and populate consumer and coupon fields
    const consumerCoupons = await ConsumerCoupon.find({ consumer: consumerId })
      .populate({
        path: "consumer",
        populate: { path: "user", select: "-password" },
      })
      // .populate({
      //   path: "coupon",
      //   populate: {
      //     path: "merchant",
      //     populate: {
      //       path: "user",
      //       select: "-password",
      //     },
      //   },
      // })
      .lean();

    // Return the cnsumerCoupons
    res.json({ consumerCoupons });
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
      return res.status(400).json({ message: "couponId is required" });
    }

    const newConsumerCoupon = await ConsumerCoupon.create({
      consumer: consumerId,
      coupon: couponId,
      qrCode: "qrCode",
      qrIdentification: "qrIdentification",
      status: "active",
    });

    res.status(201).json({
      message: "Consumer coupon added successfully",
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
      !status ||
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
      return res.status(400).json({ message: "Consumer coupon not found" });
    }

    consumerCoupon.status = status;

    const updatedConsumerCoupon = await consumerCoupon.save();

    if (updatedConsumerCoupon)
      res
        .status(200)
        .json({ message: `Status for the consumer coupon has been updated` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllConsumerCoupons,
  addConsumerCoupon,
  updateConsumerCoupon,
};
