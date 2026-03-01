const InvestmentPlan = require("../models/Investmentplan");

// ADMIN: Create plan
// POST /api/admin/plans
const createPlan = async (req, res) => {
  const { name, min, max, dailyProfit, duration, capitalReturn = true, active = true } = req.body;

  // Unique name check (case-insensitive style)
  const exists = await InvestmentPlan.findOne({ name: name.trim() });
  if (exists) {
    return res.status(409).json({ success: false, message: "Plan name already exists" });
  }

  const plan = await InvestmentPlan.create({
    name: name.trim(),
    min,
    max,
    dailyProfit,
    duration,
    capitalReturn,
    active,
    createdBy: req.user?._id || null,
    updatedBy: req.user?._id || null,
  });

  return res.status(201).json({
    success: true,
    message: "Plan created successfully",
    data: { plan },
  });
};

// ADMIN: List plans (optional filters)
// GET /api/admin/plans?active=true
const listPlansAdmin = async (req, res) => {
  const filter = {};
  if (req.query.active !== undefined) {
    filter.active = req.query.active === "true";
  }

  const plans = await InvestmentPlan.find(filter).sort({ createdAt: -1 });

  return res.json({
    success: true,
    message: "Plans fetched successfully",
    data: { plans },
  });
};

// PUBLIC/USER: List only active plans
// GET /api/plans
const listActivePlansPublic = async (req, res) => {
  const plans = await InvestmentPlan.find({ active: true }).sort({ min: 1 });

  return res.json({
    success: true,
    message: "Active plans fetched successfully",
    data: { plans },
  });
};

// ADMIN: Get single plan
// GET /api/admin/plans/:id
const getPlanById = async (req, res) => {
  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

  return res.json({ success: true, message: "Plan fetched successfully", data: { plan } });
};

// ADMIN: Update plan
// PUT /api/admin/plans/:id
const updatePlan = async (req, res) => {
  const { name, min, max, dailyProfit, duration, capitalReturn, active } = req.body;

  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

  // If name changed, ensure unique
  if (name !== undefined && name.trim() !== plan.name) {
    const exists = await InvestmentPlan.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ success: false, message: "Plan name already exists" });
    plan.name = name.trim();
  }

  if (min !== undefined) plan.min = min;
  if (max !== undefined) plan.max = max;
  if (dailyProfit !== undefined) plan.dailyProfit = dailyProfit;
  if (duration !== undefined) plan.duration = duration;
  if (capitalReturn !== undefined) plan.capitalReturn = capitalReturn;
  if (active !== undefined) plan.active = active;

  plan.updatedBy = req.user?._id || null;

  await plan.save();

  return res.json({
    success: true,
    message: "Plan updated successfully",
    data: { plan },
  });
};

// ADMIN: Toggle active (quick switch like your UI)
// PATCH /api/admin/plans/:id/toggle
const togglePlanActive = async (req, res) => {
  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

  plan.active = !plan.active;
  plan.updatedBy = req.user?._id || null;
  await plan.save();

  return res.json({
    success: true,
    message: `Plan ${plan.active ? "activated" : "deactivated"} successfully`,
    data: { plan },
  });
};

// ADMIN: Delete plan
// DELETE /api/admin/plans/:id
const deletePlan = async (req, res) => {
  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

  await plan.deleteOne();

  return res.json({
    success: true,
    message: "Plan deleted successfully",
  });
};

module.exports = {
  createPlan,
  listPlansAdmin,
  listActivePlansPublic,
  getPlanById,
  updatePlan,
  togglePlanActive,
  deletePlan,
};