/**
 * Waiting Period Rule
 * TC005: Rejects if treatment date is within waiting period from join date.
 * Uses actual date math — not just a keyword check.
 * Policy waiting periods (in days):
 *   - Initial waiting: 30 days (all conditions)
 *   - Diabetes: 90 days
 *   - Hypertension: 90 days
 *   - Pre-existing diseases: 365 days
 *   - Joint replacement: 730 days
 */
const WAITING_PERIODS = {
    diabetes: 90,
    hypertension: 90,
    joint_replacement: 730,
    initial: 30
};

const checkWaitingPeriod = (diagnosis, joinDate, treatmentDate) => {
    const dx = (diagnosis || "").toLowerCase();

    // Determine which waiting period applies
    let requiredDays = null;
    let conditionName = null;

    if (dx.includes("diabetes")) {
        requiredDays = WAITING_PERIODS.diabetes;
        conditionName = "Diabetes";
    } else if (dx.includes("hypertension") || dx.includes("high blood pressure")) {
        requiredDays = WAITING_PERIODS.hypertension;
        conditionName = "Hypertension";
    } else if (dx.includes("joint replacement")) {
        requiredDays = WAITING_PERIODS.joint_replacement;
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