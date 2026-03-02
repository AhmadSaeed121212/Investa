const mongoose = require("mongoose");

const referralCommissionSchema = new mongoose.Schema(
  {
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    beneficiaryUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    level: { type: Number, required: true, min: 1, max: 5 },
    baseAmount: { type: Number, required: true, min: 0 },
    percent: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    investment: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferralCommission", referralCommissionSchema);
