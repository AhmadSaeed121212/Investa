const createWithdrawalValidator = (req) => {
  const { amountUSD, withdrawAddress, paymentMethodId } = req.body;
  const errors = [];
  if (!amountUSD || Number(amountUSD) <= 0) errors.push("amountUSD must be greater than 0");
  if (!withdrawAddress || withdrawAddress.trim().length < 6) errors.push("withdrawAddress is required");
  if (!paymentMethodId) errors.push("paymentMethodId is required");
  return errors;
};

const reviewWithdrawalValidator = (req) => {
  const { action, denyReason } = req.body;
  const errors = [];
  if (!["APPROVE", "DENY"].includes(action)) errors.push("action must be APPROVE or DENY");
  if (action === "DENY" && (!denyReason || denyReason.trim().length < 3)) errors.push("denyReason required for deny");
  return errors;
};

module.exports = { createWithdrawalValidator, reviewWithdrawalValidator };
