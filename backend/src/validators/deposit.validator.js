const createDepositValidator = (req) => {
  const { amountUSD, paymentMethodId, transactionId } = req.body;
  const errors = [];
  if (!amountUSD || Number(amountUSD) <= 0) errors.push("amountUSD must be greater than 0");
  if (!paymentMethodId) errors.push("paymentMethodId is required");
  if (!transactionId || String(transactionId).trim().length < 4) errors.push("transactionId is required");
  return errors;
};

const adminDepositReviewValidator = (req) => {
  const { action, reviewNote } = req.body;
  const errors = [];
  if (!["APPROVE", "REJECT"].includes(action)) errors.push("action must be APPROVE or REJECT");
  if (action === "REJECT" && (!reviewNote || reviewNote.trim().length < 3)) {
    errors.push("reviewNote is required for rejection");
  }
  return errors;
};

module.exports = { createDepositValidator, adminDepositReviewValidator };
