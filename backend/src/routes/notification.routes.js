const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");
const { listNotifications, markNotificationRead, broadcast } = require("../controller/notification.controller");

router.use(protect);
router.get("/", listNotifications);
router.patch("/:id/read", markNotificationRead);
router.post("/broadcast", requireAdmin, broadcast);

module.exports = router;
