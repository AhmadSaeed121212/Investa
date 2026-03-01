const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;
  let referralCode;
  if (!name || !email || !phone || !password || !confirmPassword || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  if(!role || role === null || role === undefined || role === "undefined"){
    role === "user";
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

  // referral linking (basic: store referredBy if referralCode exists)
  let referredByUser = null;
  if (referralCode) {
    referredByUser = await User.findOne({ referralCode: referralCode.trim() });
    console.log("cbbbb=====",referredByUser)
    // if invalid code, ignore (or return error—your choice)
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    referredBy: referredByUser ? referredByUser._id : null,
  });

  // Create a simple referral code based on _id (unique + short)
  user.referralCode = `INV-${String(user._id).slice(-6).toUpperCase()}`;
  await user.save();

  const token = signToken(user._id);

  return res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        referralCode: user.referralCode,
      },
    },
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  if (user.isBlocked) return res.status(403).json({ success: false, message: "Account is blocked" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user._id);

  return res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        referralCode: user.referralCode,
      },
    },
  });
};

// GET /api/auth/me
const me = async (req, res) => {
  return res.json({ success: true, message: "Profile", data: { user: req.user } });
};

module.exports = { register, login, me };