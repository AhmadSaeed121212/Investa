const mongoose = require("mongoose");

const walletLedgerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAWAL", "INVESTMENT", "PROFIT", "REFERRAL_COMMISSION", "CAPITAL_RETURN", "ADJUSTMENT"],
      required: true,
    },
    direction: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
    amount: { type: Number, required: true, min: 0 },
    balanceBefore: { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true, min: 0 },
    referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    referenceModel: { type: String, default: null },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletLedger", walletLedgerSchema);
