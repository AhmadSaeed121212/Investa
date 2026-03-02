const User = require("../models/User");
const Deposit = require("../models/Deposit");
const Withdrawal = require("../models/Withdrawal");
const WalletLedger = require("../models/WalletLedger");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok } = require("../utils/apiResponse");
const { applyWalletTransaction } = require("../services/wallet.service");

const getDashboard = asyncHandler(async (req, res) => {
  const [users, pendingDeposits, pendingWithdrawals, depositSum, withdrawSum, recentLedger] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Deposit.countDocuments({ status: "PENDING" }),
    Withdrawal.countDocuments({ status: "PENDING" }),
    Deposit.aggregate([{ $match: { status: "APPROVED" } }, { $group: { _id: null, total: { $sum: "$amountUSD" } } }]),
    Withdrawal.aggregate([{ $match: { status: "PAID" } }, { $group: { _id: null, total: { $sum: "$amountUSD" } } }]),
    WalletLedger.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email"),
  ]);

  return ok(res, "Admin dashboard fetched", {
    stats: {
      totalUsers: users,
      pendingDeposits,
      pendingWithdrawals,
      approvedDepositsAmount: depositSum[0]?.total || 0,
      paidWithdrawalsAmount: withdrawSum[0]?.total || 0,
    },
    recentTransactions: recentLedger,
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("name email phone walletBalance totalInvested totalEarnings totalReferralEarning isBlocked createdAt");
  return ok(res, "Users fetched", { users });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  user.isBlocked = Boolean(req.body.isBlocked);
  await user.save();
  return ok(res, "User status updated", { user });
});

const adjustUserWallet = asyncHandler(async (req, res) => {
  const { amount, action, note = "Admin adjustment" } = req.body;
  const num = Number(amount);
  if (!num || num <= 0) throw new AppError("amount must be > 0", 400);
  if (!["CREDIT", "DEBIT"].includes(action)) throw new AppError("action must be CREDIT or DEBIT", 400);

  await applyWalletTransaction({
    userId: req.params.id,
    amount: num,
    direction: action,
    type: "ADJUSTMENT",
    note,
  });

  const user = await User.findById(req.params.id).select("name email walletBalance");
  return ok(res, "Wallet adjusted", { user });
});

module.exports = { getDashboard, listUsers, updateUserStatus, adjustUserWallet };
