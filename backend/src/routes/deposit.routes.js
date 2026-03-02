const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");
const { validate } = require("../middleware/validate.middleware");
const { uploadDepositScreenshot } = require("../middleware/upload.middleware");
const { createDepositValidator, adminDepositReviewValidator } = require("../validators/deposit.validator");
const { createDeposit, myDeposits, pendingDeposits, reviewDeposit } = require("../controller/deposit.controller");

router.use(protect);
router.post("/", uploadDepositScreenshot.single("screenshot"), validate(createDepositValidator), createDeposit);
router.get("/my", myDeposits);

router.get("/admin/pending", requireAdmin, pendingDeposits);
router.patch("/admin/:id/review", requireAdmin, validate(adminDepositReviewValidator), reviewDeposit);

module.exports = router;
