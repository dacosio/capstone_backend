const { generateBase64QRCode } = require("../helpers/generateBase64QRCode");

const ConsumerDiscount = require("../models/ConsumerDiscount");
const Discount = require("../models/Discount");

const getAllConsumerDiscounts = async (req, res) => {
    try {
        const consumerId = req.consumerId;

        if (!consumerId) {
            return res
                .status(404)
                .json({ error: "Consumer not found. Please log in" });
        }

        // Find all consumer discounts for the consumer and populate consumer and discount fields
        const consumerDiscounts = await ConsumerDiscount.find({
            consumer: consumerId,
        })
            .populate({
                path: "consumer",
                populate: { path: "user", select: "-password" },
            })
            .populate({
                path: "discount",
                populate: {
                    path: "merchant",
                    populate: {
                        path: "user",
                        select: "-password",
                    },
                },
            })
            .lean();

        if (!consumerDiscounts?.length) {
            return res
                .status(400)
                .json({ message: "No consumer discounts found" });
        }

        // Return the consumer discounts
        res.status(200).json(consumerDiscounts);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const addConsumerDiscount = async (req, res) => {
    try {
        const consumerId = req.consumerId;

        if (!consumerId) {
            return res
                .status(404)
                .json({ error: "Consumer not found. Please log in" });
        }

        const { discountId } = req.body;

        if (!discountId) {
            return res.status(400).json({ message: "discountId is required" });
        }

        const discount = await Discount.findOne({ _id: discountId }).exec();

        if (!discount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        const qrCode = await generateBase64QRCode({
            consumer: consumerId,
            discount: discountId,
        });

        const qrIdentifications = await ConsumerDiscount.find(
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
                    .map(
                        (qrIdentificationItem) =>
                            qrIdentificationItem.qrIdentification
                    )
                    .includes(qrIdentification)
            ) {
                break;
            }
        }

        const newConsumerDiscount = await ConsumerDiscount.create({
            consumer: consumerId,
            discount: discountId,
            qrCode,
            qrIdentification,
            status: "active",
        });

        res.status(201).json({
            message: "Consumer discount added successfully",
            newConsumerDiscount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateConsumerDiscount = async (req, res) => {
    try {
        const { consumerDiscountId, status } = req.body;

        if (
            !consumerDiscountId ||
            !status ||
            !["active", "removed", "canceled", "expired"].includes(status)
        ) {
            return res.status(400).json({
                message: "consumerDiscountId and status are required",
            });
        }

        const updatedConsumerDiscount =
            await ConsumerDiscount.findByIdAndUpdate(consumerDiscountId, {
                $set: { status },
            }).exec();

        if (updatedConsumerDiscount) {
            res.status(200).json({
                message: `Status for the consumer discount has been updated to ${status}`,
            });
        } else {
            res.status(400).json({
                message: `Status for the consumer discount has not been updated to ${status}`,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllConsumerDiscounts,
    addConsumerDiscount,
    updateConsumerDiscount,
};
