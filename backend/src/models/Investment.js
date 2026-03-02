const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "InvestmentPlan", required: true },
    amount: { type: Number, required: true, min: 1 },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    durationDays: { type: Number, required: true, min: 1 },
    dailyProfit: { type: Number, required: true, min: 0 },
    capitalReturn: { type: Boolean, default: true },
    daysCredited: { type: Number, default: 0 },
    totalProfitCredited: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "COMPLETED"], default: "ACTIVE" },
    lastCreditedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);
