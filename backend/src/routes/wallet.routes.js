const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getWallet, getLedger, getReferralSummary } = require("../controller/wallet.controller");

router.use(protect);
router.get("/", getWallet);
router.get("/ledger", getLedger);
router.get("/referrals", getReferralSummary);

module.exports = router;
