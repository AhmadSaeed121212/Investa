const User = require("../models/User");
const ReferralCommission = require("../models/ReferralCommission");
const { applyWalletTransaction } = require("./wallet.service");
const { createNotification } = require("./notification.service");

const LEVEL_PERCENTS = [6, 3, 3, 3, 3];

const distributeReferralCommissions = async ({ sourceUserId, investmentId, baseAmount }) => {
  let current = await User.findById(sourceUserId).select("referredBy");

  for (let level = 1; level <= 5; level += 1) {
    if (!current || !current.referredBy) break;

    const beneficiary = await User.findById(current.referredBy);
    if (!beneficiary) break;
    if (String(beneficiary._id) === String(sourceUserId)) break;

    const percent = LEVEL_PERCENTS[level - 1];
    const amount = Number(((baseAmount * percent) / 100).toFixed(2));

    if (amount > 0) {
      await ReferralCommission.create({
        sourceUser: sourceUserId,
        beneficiaryUser: beneficiary._id,
        level,
        baseAmount,
        percent,
        amount,
        investment: investmentId,
      });

      await applyWalletTransaction({
        userId: beneficiary._id,
        amount,
        direction: "CREDIT",
        type: "REFERRAL_COMMISSION",
        note: `Level ${level} referral commission`,
        referenceId: investmentId,
        referenceModel: "Investment",
      });

      await createNotification({
        user: beneficiary._id,
        type: "REFERRAL",
        title: "Referral Commission Added",
        message: `You received $${amount} level ${level} referral commission.`,
        meta: { level, sourceUserId, investmentId },
      });
    }

    current = await User.findById(beneficiary._id).select("referredBy");
  }
};

module.exports = { distributeReferralCommissions, LEVEL_PERCENTS };
