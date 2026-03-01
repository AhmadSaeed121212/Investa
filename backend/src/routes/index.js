const express = require("express");
const router = express.Router();

// Test route
router.get("/health", (req, res) => {
  res.json({ success: true, message: "API Health OK" });
});

router.use("/auth", require("./auth.routes"));
// Public plans for user dashboard
router.use("/plans", require("./userinvestmentPlans.routes"));

// Admin plans for admin dashboard
router.use("/admin/plans", require("./InvestmentPlans.routes"));
module.exports = router;