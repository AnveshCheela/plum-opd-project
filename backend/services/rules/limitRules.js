const checkPerClaimLimit = (claimAmount) => {

    if (claimAmount > 5000) {
        return {
            decision: "REJECTED",
            rejectionReasons: [
                "PER_CLAIM_EXCEEDED"
            ],
            approvedAmount: 0,
            confidenceScore: 0.98
        };
    }

    return null;
};

module.exports = {
    checkPerClaimLimit
};