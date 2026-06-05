const checkDental = (
    procedures = []
) => {

    const whitening =
        procedures.some(item =>
            item.toLowerCase()
                .includes("whitening")
        );

    if (whitening) {

        return {
            decision: "PARTIAL",
            approvedAmount: 8000,
            confidenceScore: 0.92,
            rejectionReasons: [
                "COSMETIC_PROCEDURE"
            ]
        };
    }

    return null;
};

module.exports = {
    checkDental
};