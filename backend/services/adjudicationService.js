/**
 * Adjudication Service — Rule Engine Orchestrator
 *
 * Rules are checked in priority order per the assignment spec.
 * The engine runs ALL applicable rules and returns the first match
 * that causes a non-approval decision (safety-first approach).
 *
 * Priority:
 *  1. Network Hospital (cashless fast-track — approve before other checks)
 *  2. Fraud Detection
 *  3. Document Validation
 *  4. Dental / Cosmetic
 *  5. Pre-Authorization
 *  6. Waiting Period (needs joinDate + treatmentDate for date math)
 *  7. Coverage Exclusions
 *  8. Per-Claim Limit
 *  9. Default: APPROVED with 10% copay
 *
 * Alternative Medicine (Ayurveda, Homeopathy, Unani): 0% copay per policy.
 */

const { checkNetworkHospital } = require("./rules/networkRules");
const { checkFraud }           = require("./rules/fraudRules");
const { checkDocuments }       = require("./rules/documentRules");
const { checkDental }          = require("./rules/dentalRules");
const { checkPreAuth }         = require("./rules/preAuthRules");
const { checkWaitingPeriod }   = require("./rules/waitingPeriodRules");
const { checkCoverage }        = require("./rules/coverageRules");
const { checkPerClaimLimit }   = require("./rules/limitRules");

// Alternative medicine keywords — no copay per policy terms
const ALT_MEDICINE_KEYWORDS = [
    "ayurveda", "ayurvedic", "homeopathy", "homoeopathy",
    "unani", "panchakarma", "naturopathy"
];

const isAltMedicineTreatment = (diagnosis = "", procedures = []) => {
    const text = (diagnosis + " " + procedures.join(" ")).toLowerCase();
    return ALT_MEDICINE_KEYWORDS.some(kw => text.includes(kw));
};

const adjudicateClaim = (claimData, formData = {}) => {

    // Merge form data (member details from frontend) with AI-extracted data
    const data = { ...claimData, ...formData };

    const claimAmount = Number(data.claimAmount) ||
                        Number(data.claimAmountRequested) || 1500;

    const diagnosis   = data.diagnosis || "";
    const procedures  = data.procedures || [];
    const joinDate    = data.joinDate || formData.joinDate || null;
    const treatmentDate = data.treatmentDate || null;

    let result;

    // ── Rule 1: Network Hospital Cashless (TC010) ────────────────────────
    result = checkNetworkHospital({
        ...data,
        claimAmount
    });
    if (result) return result;

    // ── Rule 2: Fraud Detection (TC008) ─────────────────────────────────
    result = checkFraud(data.previousClaimsSameDay);
    if (result) return result;

    // ── Rule 3: Document Validation (TC004) ──────────────────────────────
    result = checkDocuments(claimData);
    if (result) return result;

    // ── Rule 4: Dental / Cosmetic (TC002) ────────────────────────────────
    result = checkDental(procedures);
    if (result) return result;

    // ── Rule 5: Pre-Authorization (TC007) ────────────────────────────────
    result = checkPreAuth(data.testsPrescribed, claimAmount);
    if (result) return result;

    // ── Rule 6: Waiting Period with real date math (TC005) ───────────────
    result = checkWaitingPeriod(diagnosis, joinDate, treatmentDate);
    if (result) return result;

    // ── Rule 7: Coverage Exclusions (TC009) ──────────────────────────────
    result = checkCoverage(diagnosis);
    if (result) return result;

    // ── Rule 8: Per-Claim Limit (TC003) ──────────────────────────────────
    result = checkPerClaimLimit(claimAmount);
    if (result) return result;

    // ── Default: APPROVED ────────────────────────────────────────────────
    // TC006 fix: Alternative medicine has 0% copay per policy.
    // All other treatments: 10% copay (approve at 90%).
    const altMedicine = isAltMedicineTreatment(diagnosis, procedures);
    const copayRate   = altMedicine ? 0 : 0.10;
    const approvedAmount = Math.round(claimAmount * (1 - copayRate));

    return {
        decision: "APPROVED",
        approvedAmount,
        confidenceScore: 0.95,
        rejectionReasons: [],
        notes: altMedicine
            ? "Alternative medicine treatment approved with no copay per policy terms."
            : `Approved at ${Math.round((1 - copayRate) * 100)}% after ${Math.round(copayRate * 100)}% copay deduction.`
    };
};

module.exports = adjudicateClaim;