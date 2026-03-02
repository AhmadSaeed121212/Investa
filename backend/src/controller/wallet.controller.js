const WalletLedger = require("../models/WalletLedger");
const ReferralCommission = require("../models/ReferralCommission");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/apiResponse");

const getWallet = asyncHandler(async (req, res) => {
  return ok(res, "Wallet fetched", {
    walletBalance: req.user.walletBalance,
    totalInvested: req.user.totalInvested,
    totalEarnings: req.user.totalEarnings,
    totalReferralEarning: req.user.totalReferralEarning,
  });
});

const getLedger = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    WalletLedger.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    WalletLedger.countDocuments({ user: req.user._id }),
  ]);

  return ok(res, "Wallet ledger fetched", { items, pagination: { page, limit, total } });
});

const getReferralSummary = asyncHandler(async (req, res) => {
  const summary = await ReferralCommission.aggregate([
    { $match: { beneficiaryUser: req.user._id } },
    { $group: { _id: "$level", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const total = summary.reduce((acc, row) => acc + row.total, 0);
  return ok(res, "Referral summary fetched", { byLevel: summary, total });
});

module.exports = { getWallet, getLedger, getReferralSummary };
