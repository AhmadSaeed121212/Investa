const InvestmentPlan = require("../models/Investmentplan");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ok, created } = require("../utils/apiResponse");

const createPlan = asyncHandler(async (req, res) => {
  const { name, min, max, dailyProfit, duration, capitalReturn = true, active = true } = req.body;
  if (await InvestmentPlan.findOne({ name: String(name).trim() })) throw new AppError("Plan name already exists", 409);

  const plan = await InvestmentPlan.create({
    name: String(name).trim(),
    min: Number(min),
    max: Number(max),
    dailyProfit: Number(dailyProfit),
    duration: Number(duration),
    capitalReturn,
    active,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  return created(res, "Plan created successfully", { plan });
});

const listPlansAdmin = asyncHandler(async (req, res) => {
  const filter = req.query.active !== undefined ? { active: req.query.active === "true" } : {};
  const plans = await InvestmentPlan.find(filter).sort({ createdAt: -1 });
  return ok(res, "Plans fetched", { plans });
});

const listActivePlansPublic = asyncHandler(async (req, res) => {
  const plans = await InvestmentPlan.find({ active: true }).sort({ min: 1 });
  return ok(res, "Active plans fetched", { plans });
});

const getPlanById = asyncHandler(async (req, res) => {
  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) throw new AppError("Plan not found", 404);
  return ok(res, "Plan fetched", { plan });
});

const updatePlan = asyncHandler(async (req, res) => {
  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) throw new AppError("Plan not found", 404);
  Object.assign(plan, req.body, { updatedBy: req.user._id });
  await plan.save();
  return ok(res, "Plan updated", { plan });
});

const togglePlanActive = asyncHandler(async (req, res) => {
  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) throw new AppError("Plan not found", 404);
  plan.active = !plan.active;
  plan.updatedBy = req.user._id;
  await plan.save();
  return ok(res, "Plan toggled", { plan });
});

const deletePlan = asyncHandler(async (req, res) => {
  const plan = await InvestmentPlan.findById(req.params.id);
  if (!plan) throw new AppError("Plan not found", 404);
  await plan.deleteOne();
  return ok(res, "Plan deleted", null);
});

module.exports = { createPlan, listPlansAdmin, listActivePlansPublic, getPlanById, updatePlan, togglePlanActive, deletePlan };
