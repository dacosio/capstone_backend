const { generateBase64QRCode } = require("../helpers/generateBase64QRCode");

const ConsumerCoupon = require("../models/ConsumerCoupon");
// const Coupon = require("../models/Coupon");

const getAllConsumerCoupons = async (req, res) => {
  try {
    const consumerId = req.consumerId;

    if (!consumerId) {
      return res
        .status(404)
        .json({ error: "Consumer not found. Please log in" });
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

    if (!consumerCoupons?.length) {
      return res.status(400).json({ message: "No consumer coupons found" });
    }

    // Return the consumer coupons
    res.status(200).json(consumerCoupons);
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
      return res
        .status(404)
        .json({ error: "Consumer not found. Please log in" });
    }

    const { couponId } = req.body;

    if (!couponId) {
      return res.status(400).json({ message: "couponId is required" });
    }

    // const coupon = await Coupon.findOne(couponId).exec();

    // if (!coupon) {
    //   return res.status(404).json({ message: "Coupon not found" });
    // }

    const qrCode = await generateBase64QRCode({
      consumer: consumerId,
      coupon: couponId,
    });

    const qrIdentifications = await ConsumerCoupon.find(
      {},
      { _id: 0, qrIdentification: 1 }
    );

    let qrIdentification;
    while (true) {
      qrIdentification = "";

      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * characters.length);
        qrIdentification += characters[index];
      }

      if (
        !qrIdentifications
          .map((qrIdentificationItem) => qrIdentificationItem.qrIdentification)
          .includes(qrIdentification)
      ) {
        break;
      }
    }

    const newConsumerCoupon = await ConsumerCoupon.create({
      consumer: consumerId,
      coupon: couponId,
      qrCode,
      qrIdentification,
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

    const updatedConsumerCoupon = await ConsumerCoupon.findByIdAndUpdate(
      consumerCouponId,
      { $set: { status: status } }
    ).exec();

    if (updatedConsumerCoupon) {
      res.status(200).json({
        message: `Status for the consumer coupon has been updated to ${status}`,
      });
    } else {
      res.status(400).json({ message: "Consumer coupon not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllConsumerCoupons,
  addConsumerCoupon,
  updateConsumerCoupon,
};
