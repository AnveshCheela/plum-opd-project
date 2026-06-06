const checkWaitingPeriod = (diagnosis, joinDate, treatmentDate, config) => {
    const dx = (diagnosis || "").toLowerCase();

    // Determine which waiting period applies
    let requiredDays = null;
    let conditionName = null;

    if (dx.includes("diabetes")) {
        requiredDays = (config && config.waitingPeriodDiabetes) || 90;
        conditionName = "Diabetes";
    } else if (dx.includes("hypertension") || dx.includes("high blood pressure")) {
        requiredDays = (config && config.waitingPeriodHypertension) || 90;
        conditionName = "Hypertension";
    } else if (dx.includes("joint replacement")) {
        requiredDays = (config && config.waitingPeriodJointReplacement) || 730;
        conditionName = "Joint Replacement";
    }

    if (!requiredDays) return null; // No waiting period applies

    // If we have both dates, do real calculation
    if (joinDate && treatmentDate) {
        const join = new Date(joinDate);
        const treatment = new Date(treatmentDate);

        if (!isNaN(join) && !isNaN(treatment)) {
            const daysDiff = Math.floor(
                (treatment - join) / (1000 * 60 * 60 * 24)
            );

            if (daysDiff >= requiredDays) {
                return null; // Waiting period satisfied — allow claim
            }

            const daysRemaining = requiredDays - daysDiff;
            const eligibleDate = new Date(join);
            eligibleDate.setDate(eligibleDate.getDate() + requiredDays);
            const eligibleStr = eligibleDate.toISOString().split("T")[0];

            return {
                decision: "REJECTED",
                rejectionReasons: ["WAITING_PERIOD"],
                approvedAmount: 0,
                confidenceScore: 0.96,
                notes: `${conditionName} has a ${requiredDays}-day waiting period. Member joined on ${joinDate}. Treatment date ${treatmentDate} is ${daysRemaining} days too early. Eligible from ${eligibleStr}.`
            };
        }
    }

    // Fallback: if no dates provided, still flag it (conservative approach)
    return {
        decision: "REJECTED",
        rejectionReasons: ["WAITING_PERIOD"],
        approvedAmount: 0,
        confidenceScore: 0.96,
        notes: `${conditionName} has a ${requiredDays}-day waiting period. Join date not provided — cannot verify eligibility.`
    };
};

module.exports = { checkWaitingPeriod };