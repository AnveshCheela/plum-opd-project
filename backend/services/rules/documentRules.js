/**
 * Document Validation Rule
 * TC004: Rejects if prescription or doctor registration is missing
 * Also rejects if claimData is completely empty (OCR failure)
 */
const checkDocuments = (claimData, formData = {}) => {

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

    // ── Check Patient Name Mismatch (PATIENT_MISMATCH) ──
    const formName = (formData.memberName || "").toLowerCase().trim();
    const docName = (claimData.patientName || "").toLowerCase().trim();
    if (formName && docName && formName !== docName) {
        const formWords = formName.split(/\s+/);
        const hasOverlap = formWords.some(word => word.length > 2 && docName.includes(word));
        if (!hasOverlap) {
            return {
                decision: "REJECTED",
                rejectionReasons: ["PATIENT_MISMATCH"],
                approvedAmount: 0,
                confidenceScore: 0.95,
                notes: `Patient name in document ("${claimData.patientName}") does not match member name on record ("${formData.memberName}").`
            };
        }
    }

    // ── Check Date Mismatch (DATE_MISMATCH) ──
    const formDateStr = formData.treatmentDate;
    const docDateStr = claimData.treatmentDate;
    if (formDateStr && docDateStr) {
        const formDate = new Date(formDateStr);
        const docDate = new Date(docDateStr);
        if (!isNaN(formDate) && !isNaN(docDate)) {
            if (formDate.toDateString() !== docDate.toDateString()) {
                return {
                    decision: "REJECTED",
                    rejectionReasons: ["DATE_MISMATCH"],
                    approvedAmount: 0,
                    confidenceScore: 0.95,
                    notes: `Treatment date in document (${docDateStr}) does not match the submitted date (${formDateStr}).`
                };
            }
        }
    }

    return null;
};

module.exports = { checkDocuments };