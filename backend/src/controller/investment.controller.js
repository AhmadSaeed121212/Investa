const Investment = require("../models/Investment");
const InvestmentPlan = require("../models/Investmentplan");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { created, ok } = require("../utils/apiResponse");
const { applyWalletTransaction } = require("../services/wallet.service");
const { distributeReferralCommissions } = require("../services/referral.service");

const createInvestment = asyncHandler(async (req, res) => {
  const { planId, amount } = req.body;
  const plan = await InvestmentPlan.findById(planId);
  if (!plan || !plan.active) throw new AppError("Plan is not available", 400);
  if (Number(amount) < plan.min || Number(amount) > plan.max) throw new AppError("Amount outside plan limits", 400);
  if (req.user.walletBalance < Number(amount)) throw new AppError("Insufficient wallet balance", 400);

  await applyWalletTransaction({
    userId: req.user._id,
    amount: Number(amount),
    direction: "DEBIT",
    type: "INVESTMENT",
    note: `Invested in ${plan.name}`,
    referenceModel: "Investment",
  });

  const startAt = new Date();
  const endAt = new Date(startAt.getTime() + plan.duration * 86400000);
  const dailyProfit = Number(((Number(amount) * plan.dailyProfit) / 100).toFixed(2));

  const investment = await Investment.create({
    user: req.user._id,
    plan: plan._id,
    amount: Number(amount),
    startAt,
    endAt,
    durationDays: plan.duration,
    dailyProfit,
    capitalReturn: plan.capitalReturn,
  });

  await distributeReferralCommissions({ sourceUserId: req.user._id, investmentId: investment._id, baseAmount: Number(amount) });

  return created(res, "Investment created", { investment });
});

const listMyInvestments = asyncHandler(async (req, res) => {
  const investments = await Investment.find({ user: req.user._id }).populate("plan").sort({ createdAt: -1 });
  return ok(res, "Investments fetched", { investments });
});

const creditEarningsOnDemand = asyncHandler(async (req, res) => {
  const now = new Date();
  const investments = await Investment.find({ user: req.user._id, status: "ACTIVE" });
  let creditedTotal = 0;

  for (const inv of investments) {
    const elapsedDays = Math.min(inv.durationDays, Math.floor((now - inv.startAt) / 86400000));
    const dueDays = elapsedDays - inv.daysCredited;

    if (dueDays > 0) {
      const amount = Number((dueDays * inv.dailyProfit).toFixed(2));
      await applyWalletTransaction({
        userId: req.user._id,
        amount,
        direction: "CREDIT",
        type: "PROFIT",
        note: `Profit credit for ${dueDays} day(s)`,
        referenceId: inv._id,
        referenceModel: "Investment",
      });
      inv.daysCredited += dueDays;
      inv.totalProfitCredited += amount;
      inv.lastCreditedAt = now;
      creditedTotal += amount;
    }

    if (inv.daysCredited >= inv.durationDays) {
      if (inv.capitalReturn && inv.status !== "COMPLETED") {
        await applyWalletTransaction({
          userId: req.user._id,
          amount: inv.amount,
          direction: "CREDIT",
          type: "CAPITAL_RETURN",
          note: "Capital returned on completion",
          referenceId: inv._id,
          referenceModel: "Investment",
        });
      }
      inv.status = "COMPLETED";
    }

    await inv.save();
  }

  return ok(res, "Earnings credited", { creditedTotal });
});

module.exports = { createInvestment, listMyInvestments, creditEarningsOnDemand };
