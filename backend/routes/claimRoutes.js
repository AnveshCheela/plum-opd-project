const express = require("express");
const multer = require("multer");

const router = express.Router();
const extractText = require("../services/ocrService");
const extractClaimData = require("../services/aiService");
const adjudicateClaim = require("../services/adjudicationService");
const Claim = require("../models/Claim");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  upload.single("document"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No document uploaded"
        });
      }

      // OCR
      const text = await extractText(req.file.path);

      // Gemini
      const extractedData =
        await extractClaimData(text);

      // Rule Engine — pass both AI-extracted data AND form fields
      const formData = {
        memberId:        req.body.memberId,
        memberName:      req.body.memberName,
        hospitalName:    req.body.hospitalName,
        joinDate:        req.body.joinDate,
        claimAmountRequested: Number(req.body.claimAmount),
        cashlessRequest: req.body.cashlessRequest === "true",
        networkHospital: req.body.networkHospital === "true",
        previousClaimsSameDay: Number(req.body.previousClaimsSameDay) || 0
      };
      const decision = adjudicateClaim(extractedData, formData);

      // Save to MongoDB
      await Claim.create({

  memberId: req.body.memberId,
  memberName: req.body.memberName,
  hospitalName: req.body.hospitalName,
  claimAmountRequested: Number(req.body.claimAmount),
  joinDate: req.body.joinDate,
  cashlessRequest: req.body.cashlessRequest === "true",
  networkHospital: req.body.networkHospital === "true",

  patientName: extractedData.patientName,
  doctorName: extractedData.doctorName,
  doctorRegistration: extractedData.doctorRegistration,
  diagnosis: extractedData.diagnosis,
  treatmentDate: extractedData.treatmentDate,
  documentType: extractedData.documentType,
  medicines: extractedData.medicines,

  claimAmount: extractedData.claimAmount || 0,

  decision: decision.decision,
  approvedAmount: decision.approvedAmount,
  confidenceScore: decision.confidenceScore,
  rejectionReasons: decision.rejectionReasons
});

res.json({
  success: true,
  extractedData,
  decision
});

    } catch (error) {
      console.error("=== Upload Route Error ===");
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);

      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }

  }
);
router.post("/test", (req, res) => {

    const result =
        adjudicateClaim(req.body);

    res.json(result);

});
router.get("/", async (req,res)=>{

   const claims =
      await Claim.find();

   res.json(claims);

});
router.get("/stats", async (req, res) => {
  try {
    const claims = await Claim.find();

    const totalClaims = claims.length;

    const approved = claims.filter(
      c => c.decision === "APPROVED"
    ).length;

    const rejected = claims.filter(
      c => c.decision === "REJECTED"
    ).length;

    const manualReview = claims.filter(
      c => c.decision === "MANUAL_REVIEW"
    ).length;

    const totalApprovedAmount =
      claims.reduce(
        (sum, claim) =>
          sum + (claim.approvedAmount || 0),
        0
      );
      const totalClaimedAmount = claims.reduce(
  (sum, claim) =>
    sum +
    (
      claim.claimAmountRequested ||
      claim.claimAmount ||
      0
    ),
  0
);

const savings =
  totalClaimedAmount -
  totalApprovedAmount;

const approvalRate =
  totalClaims > 0
    ? (
        (approved / totalClaims) *
        100
      ).toFixed(1)
    : 0;
    res.json({
  totalClaims,
  approved,
  rejected,
  manualReview,
  totalApprovedAmount,

  totalClaimedAmount,
  savings,
  approvalRate
});

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;