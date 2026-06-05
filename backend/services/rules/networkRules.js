/**
 * Network Hospital Rule
 * TC010: Cashless approval with 20% network discount for network hospitals.
 * Policy network hospitals: Apollo, Fortis, Max, Manipal, Narayana
 * Network discount: 20% (approve at 80% of claimed amount)
 */
const NETWORK_HOSPITALS = [
    "apollo hospitals",
    "fortis healthcare",
    "max healthcare",
    "manipal hospitals",
    "narayana health"
];

const checkNetworkHospital = (claimData) => {
    const hospitalName = (claimData.hospitalName || claimData.hospital || "").toLowerCase().trim();
    const isCashless = claimData.cashlessRequest === true || claimData.cashless_request === true;
    const isNetworkHospital = claimData.networkHospital === true ||
        NETWORK_HOSPITALS.some(h => hospitalName.includes(h));

    if (isCashless && isNetworkHospital) {
        const claimAmount = Number(claimData.claimAmount) || Number(claimData.claimAmountRequested) || 0;
        const networkDiscount = claimAmount * 0.20;
        const approvedAmount = claimAmount * 0.80;

        return {
            decision: "APPROVED",
            approvedAmount: Math.round(approvedAmount),
            confidenceScore: 0.93,
            rejectionReasons: [],
            cashlessApproved: true,
            networkDiscount: Math.round(networkDiscount),
            notes: `Cashless approved at network hospital. 20% network discount of ₹${Math.round(networkDiscount)} applied.`
        };
    }

    return null;
};

module.exports = { checkNetworkHospital };