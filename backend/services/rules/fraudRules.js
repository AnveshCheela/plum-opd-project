const checkFraud = (
    previousClaimsSameDay = 0
) => {

    if (previousClaimsSameDay > 2) {

        return {
            decision: "MANUAL_REVIEW",
            rejectionReasons: [
                "FRAUD_SUSPECTED"
            ],
            approvedAmount: 0,
            confidenceScore: 0.65
        };
    }

    return null;
};

module.exports = {
    checkFraud
};