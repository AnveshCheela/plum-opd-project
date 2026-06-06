const mongoose = require("mongoose");

const policyConfigSchema = new mongoose.Schema({
  perClaimLimit: {
    type: Number,
    default: 5000
  },
  waitingPeriodDiabetes: {
    type: Number,
    default: 90
  },
  waitingPeriodHypertension: {
    type: Number,
    default: 90
  },
  waitingPeriodJointReplacement: {
    type: Number,
    default: 730
  },
  networkDiscountPercentage: {
    type: Number,
    default: 20
  },
  copayPercentage: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("PolicyConfig", policyConfigSchema);
