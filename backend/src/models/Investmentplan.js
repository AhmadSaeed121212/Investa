const mongoose = require("mongoose");

const investmentPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120, unique: true },
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },

    // daily profit percentage (e.g. 2.5)
    dailyProfit: { type: Number, required: true, min: 0 },

    // duration in days (e.g. 30)
    duration: { type: Number, required: true, min: 1 },

    capitalReturn: { type: Boolean, default: true },
    active: { type: Boolean, default: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

// Helpful index for sorting / filtering
investmentPlanSchema.index({ active: 1, createdAt: -1 });

module.exports = mongoose.model("InvestmentPlan", investmentPlanSchema);