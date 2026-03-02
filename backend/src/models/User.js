const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },

    walletBalance: { type: Number, default: 0, min: 0 },
    totalInvested: { type: Number, default: 0, min: 0 },
    totalEarnings: { type: Number, default: 0, min: 0 },
    totalReferralEarning: { type: Number, default: 0, min: 0 },

    referralCode: { type: String, unique: true, sparse: true, index: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    isBlocked: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
