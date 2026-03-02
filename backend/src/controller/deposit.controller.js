const Deposit = require("../models/Deposit");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { created, ok } = require("../utils/apiResponse");
const { applyWalletTransaction } = require("../services/wallet.service");
const { createNotification } = require("../services/notification.service");

const createDeposit = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError("Deposit screenshot is required", 400);
  const deposit = await Deposit.create({
    user: req.user._id,
    amountUSD: Number(req.body.amountUSD),
    paymentMethodId: req.body.paymentMethodId,
    transactionId: req.body.transactionId,
    screenshot: req.file.path,
  });
  return created(res, "Deposit request submitted", { deposit });
});

const myDeposits = asyncHandler(async (req, res) => {
  const deposits = await Deposit.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ok(res, "Deposit history fetched", { deposits });
});

const pendingDeposits = asyncHandler(async (req, res) => ok(res, "Pending deposits fetched", { deposits: await Deposit.find({ status: "PENDING" }).populate("user", "name email") }));

const reviewDeposit = asyncHandler(async (req, res) => {
  const deposit = await Deposit.findById(req.params.id);
  if (!deposit) throw new AppError("Deposit not found", 404);
  if (deposit.status !== "PENDING") throw new AppError("Deposit already reviewed", 400);

  const { action, reviewNote = "" } = req.body;
  deposit.status = action === "APPROVE" ? "APPROVED" : "REJECTED";
  deposit.reviewNote = reviewNote;
  deposit.reviewedBy = req.user._id;
  deposit.reviewedAt = new Date();
  await deposit.save();

  if (action === "APPROVE") {
    await applyWalletTransaction({
      userId: deposit.user,
      amount: deposit.amountUSD,
      direction: "CREDIT",
      type: "DEPOSIT",
      note: "Deposit approved",
      referenceId: deposit._id,
      referenceModel: "Deposit",
    });
  }

  await createNotification({
    user: deposit.user,
    type: "DEPOSIT",
    title: `Deposit ${deposit.status}`,
    message: action === "APPROVE" ? `Your deposit of $${deposit.amountUSD} was approved.` : `Your deposit was rejected.`,
    meta: { depositId: deposit._id, reviewNote },
  });

  return ok(res, `Deposit ${deposit.status.toLowerCase()}`, { deposit });
});

module.exports = { createDeposit, myDeposits, pendingDeposits, reviewDeposit };
