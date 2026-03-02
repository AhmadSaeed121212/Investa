const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { createInvestmentValidator } = require("../validators/investment.validator");
const { createInvestment, listMyInvestments, creditEarningsOnDemand } = require("../controller/investment.controller");

router.use(protect);
router.post("/", validate(createInvestmentValidator), createInvestment);
router.get("/my", listMyInvestments);
router.post("/my/credit-earnings", creditEarningsOnDemand);

module.exports = router;
