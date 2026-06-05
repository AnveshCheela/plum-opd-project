const checkPreAuth = (
    testsPrescribed,
    claimAmount
) => {

    const tests =
        testsPrescribed || [];

    const hasMRI =
        tests.some(test =>
            test.toLowerCase().includes("mri")
        );

    if (
        hasMRI &&
        claimAmount > 10000
    ) {

        return {
            decision: "REJECTED",
            rejectionReasons: [
                "PRE_AUTH_MISSING"
            ],
            approvedAmount: 0,
            confidenceScore: 0.94
        };
    }

    return null;
};

module.exports = {
    checkPreAuth
};