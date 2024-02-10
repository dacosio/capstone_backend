const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");
const Payment = require("../models/Payment");

const getAllTransactions = async (req, res) => {
  try {
    const { consumerCouponId } = req.body;

    if (!consumerCouponId) {
      return res.status(400).json({ message: "consumerCouponId is required" });
    }

    // Find all transactions for the consumer coupon and populate payment and consumerCoupon fields
    const transactions = await Transaction.find({
      consumerCoupon: consumerCouponId,
    })
      .populate({
        path: "payment",
      })
      .populate({
        path: "consumerCoupon",
        // populate: { path: "coupon"},
      })
      .lean();

    // Return the transactions
    res.status(200).json(transactions);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addTransaction = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, status, consumerCouponId } = req.body;

    if (
      !amount ||
      !status ||
      !["approved", "canceled"].includes(status) ||
      !consumerCouponId
    ) {
      return res
        .status(400)
        .json({ message: "amount, status, and consumerCouponId are required" });
    }

    const newPayment = await Payment.create(
      [
        {
          amount,
          date: new Date(),
          status,
        },
      ],
      { session }
    );

    const newTransaction = await Transaction.create(
      [
        {
          payment: newPayment[0].id,
          consumerCoupon: consumerCouponId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Transaction added successfully",
      newPayment,
      newTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
};
