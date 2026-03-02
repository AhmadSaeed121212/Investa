const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amountUSD: { type: Number, required: true, min: 1 },
    withdrawAddress: { type: String, required: true, trim: true },
    paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
    status: { type: String, enum: ["PENDING", "PAID", "DENIED"], default: "PENDING", index: true },
    txHash: { type: String, default: "" },
    denyReason: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
