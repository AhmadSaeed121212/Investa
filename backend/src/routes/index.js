const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API Health OK", data: null, errors: null });
});

router.use("/auth", require("./auth.routes"));
router.use("/plans", require("./userinvestmentPlans.routes"));
router.use("/admin/plans", require("./InvestmentPlans.routes"));
router.use("/wallet", require("./wallet.routes"));
router.use("/deposits", require("./deposit.routes"));
router.use("/withdrawals", require("./withdrawal.routes"));
router.use("/investments", require("./investment.routes"));
router.use("/notifications", require("./notification.routes"));
router.use("/payment-methods", require("./paymentMethod.routes"));
router.use("/admin", require("./admin.routes"));

module.exports = router;
