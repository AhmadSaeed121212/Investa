const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");
const { validate } = require("../middleware/validate.middleware");
const { createWithdrawalValidator, reviewWithdrawalValidator } = require("../validators/withdrawal.validator");
const { createWithdrawal, myWithdrawals, pendingWithdrawals, reviewWithdrawal } = require("../controller/withdrawal.controller");

router.use(protect);
router.post("/", validate(createWithdrawalValidator), createWithdrawal);
router.get("/my", myWithdrawals);

router.get("/admin/pending", requireAdmin, pendingWithdrawals);
router.patch("/admin/:id/review", requireAdmin, validate(reviewWithdrawalValidator), reviewWithdrawal);

module.exports = router;
