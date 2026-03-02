const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { created, ok } = require("../utils/apiResponse");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = "user", referralCode } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError("Email already registered", 409);

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.trim() });
    if (!referrer) throw new AppError("Invalid referral code", 400);
    referredBy = referrer._id;
  }

  const user = await User.create({ name, email, phone, password, role, referredBy });
  user.referralCode = `INV-${String(user._id).slice(-6).toUpperCase()}`;
  await user.save();

  return created(res, "Registered successfully", {
    token: signToken(user._id),
    user,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);
  if (user.isBlocked) throw new AppError("Account is blocked", 403);

  const match = await user.comparePassword(password);
  if (!match) throw new AppError("Invalid credentials", 401);

  user.lastLoginAt = new Date();
  await user.save();

  return ok(res, "Login successful", {
    token: signToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
    },
  });
});

const me = asyncHandler(async (req, res) => ok(res, "Profile fetched", { user: req.user }));

module.exports = { register, login, me };
