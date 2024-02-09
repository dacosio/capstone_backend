const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rating", RatingSchema);
