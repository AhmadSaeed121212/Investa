const validatePlanPayload = (req, res, next) => {
  const { name, min, max, dailyProfit, duration, capitalReturn, active } = req.body;

  // For PATCH/PUT we might not send all fields, so only validate what's present.
  const isCreate = req.method === "POST";

  const errors = [];

  const isNum = (v) => typeof v === "number" && Number.isFinite(v);

  if (isCreate || name !== undefined) {
    if (!name || typeof name !== "string" || !name.trim()) errors.push("Plan name is required");
  }

  if (isCreate || min !== undefined) {
    if (!isNum(min) || min < 0) errors.push("min must be a number >= 0");
  }

  if (isCreate || max !== undefined) {
    if (!isNum(max) || max < 0) errors.push("max must be a number >= 0");
  }

  if ((isCreate || (min !== undefined && max !== undefined)) && isNum(min) && isNum(max)) {
    if (min > max) errors.push("min cannot be greater than max");
  }

  if (isCreate || dailyProfit !== undefined) {
    if (!isNum(dailyProfit) || dailyProfit < 0) errors.push("dailyProfit must be a number >= 0");
  }

  if (isCreate || duration !== undefined) {
    if (!isNum(duration) || duration < 1) errors.push("duration must be a number >= 1");
  }

  if (capitalReturn !== undefined && typeof capitalReturn !== "boolean") {
    errors.push("capitalReturn must be boolean");
  }

  if (active !== undefined && typeof active !== "boolean") {
    errors.push("active must be boolean");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  next();
};

module.exports = { validatePlanPayload };