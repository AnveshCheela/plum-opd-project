const checkPerClaimLimit = (claimAmount, config) => {
    const limit = (config && config.perClaimLimit) || 5000;

    if (claimAmount > limit) {
        return {
            decision: "REJECTED",
            rejectionReasons: [
                "PER_CLAIM_EXCEEDED"
            ],
            approvedAmount: 0,
            confidenceScore: 0.98,
            notes: `Claim amount ₹${claimAmount} exceeds the policy per-claim limit of ₹${limit}.`
        };
    }

    return null;
};

module.exports = {
    checkPerClaimLimit
};