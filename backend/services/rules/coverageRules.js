const checkCoverage = (diagnosis) => {

    diagnosis =
        diagnosis?.toLowerCase() || "";

    if (
        diagnosis.includes("obesity") ||
        diagnosis.includes("weight loss")
    ) {

        return {
            decision: "REJECTED",
            rejectionReasons: [
                "SERVICE_NOT_COVERED"
            ],
            approvedAmount: 0,
            confidenceScore: 0.95
        };
    }

    return null;
};

module.exports = {
    checkCoverage
};