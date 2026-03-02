const express = require("express");
const router = express.Router();
const { listActivePaymentMethods, createPaymentMethod } = require("../controller/paymentMethod.controller");
const { protect } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");

router.get("/", listActivePaymentMethods);
router.post("/", protect, requireAdmin, createPaymentMethod);

module.exports = router;
