const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");
const { validate } = require("../middleware/validate.middleware");
const { planValidator } = require("../validators/plan.validator");
const {
  createPlan,
  listPlansAdmin,
  getPlanById,
  updatePlan,
  togglePlanActive,
  deletePlan,
} = require("../controller/investmentPlan");

router.use(protect, requireAdmin);
router.post("/", validate(planValidator), createPlan);
router.get("/", listPlansAdmin);
router.get("/:id", getPlanById);
router.put("/:id", validate(planValidator), updatePlan);
router.patch("/:id/toggle", togglePlanActive);
router.delete("/:id", deletePlan);

module.exports = router;
