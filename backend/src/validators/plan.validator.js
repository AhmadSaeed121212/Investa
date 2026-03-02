const planValidator = (req) => {
  const { name, min, max, dailyProfit, duration } = req.body;
  const isCreate = req.method === "POST";
  const errors = [];

  const checkNumber = (v) => Number.isFinite(Number(v));

  if (isCreate || name !== undefined) if (!name || String(name).trim().length < 2) errors.push("name is required");
  if (isCreate || min !== undefined) if (!checkNumber(min) || Number(min) < 0) errors.push("min must be >= 0");
  if (isCreate || max !== undefined) if (!checkNumber(max) || Number(max) < 0) errors.push("max must be >= 0");
  if (isCreate || dailyProfit !== undefined) if (!checkNumber(dailyProfit) || Number(dailyProfit) < 0) errors.push("dailyProfit must be >= 0");
  if (isCreate || duration !== undefined) if (!checkNumber(duration) || Number(duration) < 1) errors.push("duration must be >= 1");

  if (checkNumber(min) && checkNumber(max) && Number(min) > Number(max)) errors.push("min cannot exceed max");

  return errors;
};

module.exports = { planValidator };
