const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) throw new AppError("Not authorized, missing token", 401);

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new AppError("User not found", 401);
  if (user.isBlocked) throw new AppError("Account is blocked", 403);

  req.user = user;
  next();
});

module.exports = { protect };
