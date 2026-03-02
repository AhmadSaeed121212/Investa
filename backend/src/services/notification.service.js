const Notification = require("../models/Notification");

const createNotification = async ({ user, type, title, message, meta = {} }) => {
  return Notification.create({ user, type, title, message, meta });
};

module.exports = { createNotification };
