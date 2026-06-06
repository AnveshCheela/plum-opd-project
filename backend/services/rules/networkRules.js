const NETWORK_HOSPITALS = [
    "apollo hospitals",
    "fortis healthcare",
    "max healthcare",
    "manipal hospitals",
    "narayana health"
];

const checkNetworkHospital = (claimData, config) => {
    const hospitalName = (claimData.hospitalName || claimData.hospital || "").toLowerCase().trim();
    const isCashless = claimData.cashlessRequest === true || claimData.cashless_request === true;
    const isNetworkHospital = claimData.networkHospital === true ||
        NETWORK_HOSPITALS.some(h => hospitalName.includes(h));

    if (isCashless && isNetworkHospital) {
        const discountPercentage = (config && config.networkDiscountPercentage) !== undefined ? config.networkDiscountPercentage : 20;
        const discountRate = discountPercentage / 100;
        
        const claimAmount = Number(claimData.claimAmount) || Number(claimData.claimAmountRequested) || 0;
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
    }

    return null;
};

module.exports = { checkNetworkHospital };