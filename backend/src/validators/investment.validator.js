const createInvestmentValidator = (req) => {
  const { planId, amount } = req.body;
  const errors = [];
  if (!planId) errors.push("planId is required");
  if (!amount || Number(amount) <= 0) errors.push("amount must be greater than 0");
  return errors;
};

module.exports = { createInvestmentValidator };
