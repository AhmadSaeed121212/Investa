const User = require("../models/User");
const WalletLedger = require("../models/WalletLedger");

const applyWalletTransaction = async ({ userId, amount, direction, type, note = "", referenceId = null, referenceModel = null }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const before = user.walletBalance;
  const delta = direction === "CREDIT" ? amount : -amount;
  const after = before + delta;

  if (after < 0) {
    throw new Error("Insufficient wallet balance");
  }

  user.walletBalance = after;
  if (type === "INVESTMENT") user.totalInvested += amount;
  if (["PROFIT", "REFERRAL_COMMISSION"].includes(type)) user.totalEarnings += amount;
  if (type === "REFERRAL_COMMISSION") user.totalReferralEarning += amount;

  await user.save();

  await WalletLedger.create({
    user: userId,
    type,
    direction,
    amount,
    balanceBefore: before,
    balanceAfter: after,
    note,
    referenceId,
    referenceModel,
  });

  return user;
};

module.exports = { applyWalletTransaction };
