const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");
const { getDashboard, listUsers, updateUserStatus, adjustUserWallet } = require("../controller/admin.controller");

router.use(protect, requireAdmin);
router.get("/dashboard", getDashboard);
router.get("/users", listUsers);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/wallet", adjustUserWallet);

module.exports = router;
