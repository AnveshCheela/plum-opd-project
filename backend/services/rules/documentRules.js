/**
 * Document Validation Rule
 * TC004: Rejects if prescription or doctor registration is missing
 * Also rejects if claimData is completely empty (OCR failure)
 */
const checkDocuments = (claimData) => {

    // No data at all — OCR / AI extraction completely failed
    if (!claimData || Object.keys(claimData).length === 0) {
        return {
            decision: "REJECTED",
            rejectionReasons: ["MISSING_DOCUMENTS"],
            approvedAmount: 0,
            confidenceScore: 1.0,
            notes: "No document data could be extracted. Please resubmit with a clear image."
        };
    }

    const missingDocs = [];

    // Doctor's registration number must be visible (per policy claim requirements)
    if (!claimData.doctorRegistration || claimData.doctorRegistration.trim() === "") {
        missingDocs.push("Doctor registration number missing");
    }

    // Prescription from registered doctor is required
    if (!claimData.doctorName || claimData.doctorName.trim() === "") {
        missingDocs.push("Prescription from registered doctor required");
    }

    // Diagnosis must be present
    if (!claimData.diagnosis || claimData.diagnosis.trim() === "") {
        missingDocs.push("Diagnosis not found in submitted documents");
    }

    if (missingDocs.length > 0) {
        return {
            decision: "REJECTED",
            rejectionReasons: ["MISSING_DOCUMENTS"],
            approvedAmount: 0,
            confidenceScore: 1.0,
            notes: missingDocs.join(". ")
        };
    }

    return null;
};

module.exports = { checkDocuments };