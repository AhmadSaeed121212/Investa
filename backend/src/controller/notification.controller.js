const Notification = require("../models/Notification");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { created, ok } = require("../utils/apiResponse");
const { createNotification } = require("../services/notification.service");

const listNotifications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ user: req.user._id }),
  ]);

  return ok(res, "Notifications fetched", { items, pagination: { page, limit, total } });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notification) return ok(res, "Notification not found", null);

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();
  return ok(res, "Notification marked as read", { notification });
});

const broadcast = asyncHandler(async (req, res) => {
  const users = await User.find({}, "_id");
  await Promise.all(
    users.map((u) =>
      createNotification({
        user: u._id,
        type: "SYSTEM",
        title: req.body.title,
        message: req.body.message,
      })
    )
  );
  return created(res, "Broadcast sent", { recipients: users.length });
});

module.exports = { listNotifications, markNotificationRead, broadcast };
