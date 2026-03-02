const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: ["CRYPTO", "BANK", "OTHER"], default: "CRYPTO" },
    details: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

paymentMethodSchema.statics.seedDefaults = async function () {
  const defaults = [
    { name: "TRON (TRC 20)", type: "CRYPTO", details: "TRON Network" },
    { name: "BSC (BEP 20)", type: "CRYPTO", details: "Binance Smart Chain" },
  ];
  for (const item of defaults) {
    const exists = await this.findOne({ name: item.name });
    if (!exists) await this.create(item);
  }
};

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
