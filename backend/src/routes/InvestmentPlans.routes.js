const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { validatePlanPayload } = require("../middleware/validate.middleware");

const {
  createPlan,
  listPlansAdmin,
  getPlanById,
  updatePlan,
  togglePlanActive,
  deletePlan,
} = require("../controller/investmentPlan");

// All admin plan routes are protected + admin-only
router.use(protect, adminOnly);

router.get("/", listPlansAdmin);
router.post("/", validatePlanPayload, createPlan);

router.get("/:id", getPlanById);
router.put("/:id", validatePlanPayload, updatePlan);

router.patch("/:id/toggle", togglePlanActive);

router.delete("/:id", deletePlan);

module.exports = router;