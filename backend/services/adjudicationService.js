const { checkNetworkHospital } = require("./rules/networkRules");
const { checkFraud }           = require("./rules/fraudRules");
const { checkDocuments }       = require("./rules/documentRules");
const { checkDental }          = require("./rules/dentalRules");
const { checkPreAuth }         = require("./rules/preAuthRules");
const { checkWaitingPeriod }   = require("./rules/waitingPeriodRules");
const { checkCoverage }        = require("./rules/coverageRules");
const { checkPerClaimLimit }   = require("./rules/limitRules");
const PolicyConfig             = require("../models/PolicyConfig");

// Alternative medicine keywords — no copay per policy terms
const ALT_MEDICINE_KEYWORDS = [
    "ayurveda", "ayurvedic", "homeopathy", "homoeopathy",
    "unani", "panchakarma", "naturopathy"
];

const isAltMedicineTreatment = (diagnosis = "", procedures = []) => {
    const text = (diagnosis + " " + procedures.join(" ")).toLowerCase();
    return ALT_MEDICINE_KEYWORDS.some(kw => text.includes(kw));
};

const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const adjudicateClaim = async (claimData, formData = {}, currentEmbedding = []) => {
    // 1. Fetch dynamic config from MongoDB
    let config;
    try {
        config = await PolicyConfig.findOne();
    } catch (err) {
        console.error("Failed to query policy config, using defaults:", err.message);
    }
    
    if (!config) {
        config = {
            perClaimLimit: 5000,
            waitingPeriodDiabetes: 90,
            waitingPeriodHypertension: 90,
            waitingPeriodJointReplacement: 730,
            networkDiscountPercentage: 20,
            copayPercentage: 10
        };
    }

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
    }, config);
    if (result) return result;

    // ── Rule 2: Fraud Detection (TC008) ─────────────────────────────────
    result = checkFraud(data.previousClaimsSameDay);
    if (result) return result;

    // ── Semantic RAG / Similarity check (Vector Search) ──────────────────
    if (currentEmbedding && currentEmbedding.length > 0 && data.memberId) {
        try {
            const Claim = require("../models/Claim");
            // Find all historical claims for this member
            const pastClaims = await Claim.find({ memberId: data.memberId });
            
            for (const past of pastClaims) {
                if (past.embedding && past.embedding.length === currentEmbedding.length) {
                    const similarity = cosineSimilarity(currentEmbedding, past.embedding);
                    
                    // Cosine similarity threshold for high diagnosis/procedure overlap (e.g. > 90%)
                    if (similarity > 0.90) {
                        // Check if it's on the same treatment date
                        const isCloseDate = past.treatmentDate === treatmentDate;
                        if (isCloseDate) {
                            return {
                                decision: "MANUAL_REVIEW",
                                approvedAmount: 0,
                                confidenceScore: 0.70,
                                rejectionReasons: [
                                    `SEMANTIC_DUPLICATE_SUSPECTED: Matches historical claim ID ${past._id} with ${Math.round(similarity * 100)}% similarity on the same treatment date (${treatmentDate || "N/A"}).`
                                ],
                                notes: "Flagged by Semantic Vector Similarity search."
                            };
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Vector search RAG failed:", err.message);
        }
    }

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
    result = checkWaitingPeriod(diagnosis, joinDate, treatmentDate, config);
    if (result) return result;

    // ── Rule 7: Coverage Exclusions (TC009) ──────────────────────────────
    result = checkCoverage(diagnosis);
    if (result) return result;

    // ── Rule 8: Per-Claim Limit (TC003) ──────────────────────────────────
    result = checkPerClaimLimit(claimAmount, config);
    if (result) return result;

    // ── Default: APPROVED ────────────────────────────────────────────────
    const altMedicine = isAltMedicineTreatment(diagnosis, procedures);
    const copayPercentage = (config.copayPercentage !== undefined) ? config.copayPercentage : 10;
    const copayRate = altMedicine ? 0 : (copayPercentage / 100);
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