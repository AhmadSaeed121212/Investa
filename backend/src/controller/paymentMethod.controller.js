const PaymentMethod = require("../models/PaymentMethod");
const asyncHandler = require("../utils/asyncHandler");
const { ok, created } = require("../utils/apiResponse");

const listActivePaymentMethods = asyncHandler(async (req, res) => {
  await PaymentMethod.seedDefaults();
  const methods = await PaymentMethod.find({ active: true }).sort({ createdAt: 1 });
  return ok(res, "Payment methods fetched", { methods });
});

const createPaymentMethod = asyncHandler(async (req, res) => {
  const method = await PaymentMethod.create(req.body);
  return created(res, "Payment method created", { method });
});

module.exports = { listActivePaymentMethods, createPaymentMethod };
