const NETWORK_HOSPITALS = [
    "apollo hospitals",
    "fortis healthcare",
    "max healthcare",
    "manipal hospitals",
    "narayana health"
];

const checkNetworkHospital = (claimData, formData, config) => {
    const isCashless = formData.cashlessRequest === true || formData.cashless_request === true;
    if (!isCashless) return null;

    const formHospital = (formData.hospitalName || "").toLowerCase().trim();
    const docHospital = (claimData.hospitalName || "").toLowerCase().trim();

    // Verify if the hospital in the document is actually a network hospital
    const isDocNetwork = NETWORK_HOSPITALS.some(h => docHospital.includes(h));

    // If there is a mismatch between what they filled and what the document shows
    if (formHospital && docHospital) {
        const firstWord = formHospital.split(/\s+/)[0];
        if (firstWord.length > 2 && !docHospital.includes(firstWord)) {
            return {
                decision: "MANUAL_REVIEW",
                approvedAmount: 0,
                confidenceScore: 0.85,
                rejectionReasons: ["CASHLESS_HOSPITAL_MISMATCH"],
                notes: `Cashless request hospital in form ("${formData.hospitalName}") does not match the hospital in the document ("${claimData.hospitalName}").`
            };
        }
    }

    // If the document's hospital is not a network hospital, cashless is denied
    if (!isDocNetwork) {
        return {
            decision: "REJECTED",
            rejectionReasons: ["SERVICE_NOT_COVERED"],
            approvedAmount: 0,
            confidenceScore: 0.90,
            notes: `Cashless facility is only available at network hospitals. The document indicates "${claimData.hospitalName || "unknown hospital"}", which is not in our network.`
        };
    }

    // If it is a network hospital, apply discount
    const discountPercentage = (config && config.networkDiscountPercentage) !== undefined ? config.networkDiscountPercentage : 20;
    const discountRate = discountPercentage / 100;
    
    const claimAmount = Number(formData.claimAmountRequested) || Number(claimData.claimAmount) || 0;
    const networkDiscount = claimAmount * discountRate;
    const approvedAmount = claimAmount * (1 - discountRate);

    return {
        decision: "APPROVED",
        approvedAmount: Math.round(approvedAmount),
        confidenceScore: 0.93,
        rejectionReasons: [],
        cashlessApproved: true,
        networkDiscount: Math.round(networkDiscount),
        notes: `Cashless approved at network hospital. ${discountPercentage}% network discount of ₹${Math.round(networkDiscount)} applied.`
    };
};

module.exports = { checkNetworkHospital };