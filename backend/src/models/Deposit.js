const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amountUSD: { type: Number, required: true, min: 1 },
    paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
    transactionId: { type: String, trim: true, required: true },
    screenshot: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING", index: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewNote: { type: String, default: "" },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", depositSchema);
