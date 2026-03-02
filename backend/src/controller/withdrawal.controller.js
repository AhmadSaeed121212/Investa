const Withdrawal = require("../models/Withdrawal");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { created, ok } = require("../utils/apiResponse");
const { createNotification } = require("../services/notification.service");

const createWithdrawal = asyncHandler(async (req, res) => {
  const amountUSD = Number(req.body.amountUSD);
  if (req.user.walletBalance < amountUSD) throw new AppError("Insufficient withdrawable balance", 400);

  req.user.walletBalance -= amountUSD;
  await req.user.save();

  const withdrawal = await Withdrawal.create({
    user: req.user._id,
    amountUSD,
    withdrawAddress: req.body.withdrawAddress,
    paymentMethodId: req.body.paymentMethodId,
  });

  await createNotification({
    user: req.user._id,
    type: "WITHDRAWAL",
    title: "Withdrawal Requested",
    message: `Your withdrawal of $${amountUSD} is pending review.`,
    meta: { withdrawalId: withdrawal._id },
  });

  return created(res, "Withdrawal request submitted", { withdrawal });
});

const myWithdrawals = asyncHandler(async (req, res) =>
  ok(res, "Withdrawal history fetched", { withdrawals: await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 }) })
);

const pendingWithdrawals = asyncHandler(async (req, res) =>
  ok(res, "Pending withdrawals fetched", {
    withdrawals: await Withdrawal.find({ status: "PENDING" }).populate("user", "name email walletBalance"),
  })
);

const reviewWithdrawal = asyncHandler(async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id).populate("user");
  if (!withdrawal) throw new AppError("Withdrawal not found", 404);
  if (withdrawal.status !== "PENDING") throw new AppError("Withdrawal already reviewed", 400);

  const { action, txHash = "", denyReason = "" } = req.body;
  if (action === "APPROVE") {
    withdrawal.status = "PAID";
    withdrawal.txHash = txHash;
  } else {
    withdrawal.status = "DENIED";
    withdrawal.denyReason = denyReason;
    withdrawal.user.walletBalance += withdrawal.amountUSD;
    await withdrawal.user.save();
  }

  withdrawal.reviewedBy = req.user._id;
  withdrawal.reviewedAt = new Date();
  await withdrawal.save();

  await createNotification({
    user: withdrawal.user._id,
    type: "WITHDRAWAL",
    title: `Withdrawal ${withdrawal.status}`,
    message: action === "APPROVE" ? "Your withdrawal is marked paid." : "Your withdrawal was denied and funds returned.",
    meta: { withdrawalId: withdrawal._id, txHash, denyReason },
  });

  return ok(res, `Withdrawal ${withdrawal.status.toLowerCase()}`, { withdrawal });
});

module.exports = { createWithdrawal, myWithdrawals, pendingWithdrawals, reviewWithdrawal };
