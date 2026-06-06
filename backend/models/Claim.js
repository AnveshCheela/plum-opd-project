const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({

    patientName: String,

    doctorName: String,

    doctorRegistration: String,

    diagnosis: String,

    treatmentDate: String,

    claimAmount: Number,
    memberId: String,
memberName: String,
hospitalName: String,
treatmentDate: String,
claimAmountRequested: Number,
joinDate: String,
cashlessRequest: Boolean,
networkHospital: Boolean,

    medicines: [
        {
            name: String,
            dosage: String,
            duration: String
        }
    ],

    documentType: String,

    decision: {
        type: String,
        enum: [
            "APPROVED",
            "REJECTED",
            "PARTIAL",
            "MANUAL_REVIEW",
            "INFO_REQUIRED"
        ],
        default: "MANUAL_REVIEW"
    },

    approvedAmount: {
        type: Number,
        default: 0
    },

    confidenceScore: {
        type: Number,
        default: 0
    },

    rejectionReasons: {
        type: [String],
        default: []
    },

    embedding: {
        type: [Number],
        default: []
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.model("Claim", claimSchema);