require("dotenv").config();


const express = require("express");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/Db");
const claimRoutes = require("./routes/claimRoutes");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// Auto-create uploads directory (Railway ephemeral filesystem doesn't persist it)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads/ directory");
}

const PolicyConfig = require("./models/PolicyConfig");
async function initializeConfig() {
    try {
        const count = await PolicyConfig.countDocuments();
        if (count === 0) {
            await PolicyConfig.create({
                perClaimLimit: 5000,
                waitingPeriodDiabetes: 90,
                waitingPeriodHypertension: 90,
                waitingPeriodJointReplacement: 730,
                networkDiscountPercentage: 20,
                copayPercentage: 10
            });
            console.log("Default policy configurations initialized in MongoDB.");
        }
    } catch (err) {
        console.error("Failed to initialize policy config:", err.message);
    }
}

connectDB().then(() => {
    initializeConfig();
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/claims", claimRoutes);

app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Plum OPD Backend Running 🚀" });
});

app.get("/api/test-crash", (req, res, next) => {
    console.log("Intentional backend crash triggered!");
    // Simulate a database failure or unhandled exception
    next(new Error("Database connection timed out abruptly while processing claims."));
});

// --- OpsGuardian Crash Reporter Middleware ---
app.use(async (err, req, res, next) => {
    console.error("🔥 [Plum OPD Backend] Crash Detected:", err.message);

    const webhookKey = process.env.OPSGUARDIAN_WEBHOOK_KEY || "YOUR_WEBHOOK_KEY_HERE";
    const opsguardianUrl = process.env.OPSGUARDIAN_API_URL || "http://localhost:5000/api/v1/webhooks/trigger";

    try {
        const payload = {
            webhookKey: webhookKey,
            alert: "Plum OPD Backend API Crash",
            severity: "Critical",
            errorMessage: err.message,
            errorStack: err.stack,
            url: `Backend Route: ${req.method} ${req.originalUrl}`,
            rawLog: `Plum OPD Backend Crash:\nRoute: ${req.method} ${req.originalUrl}\nMessage: ${err.message}\nStack: ${err.stack}`,
        };

        const response = await fetch(opsguardianUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("✅ [OpsGuardian] Crash successfully reported to the dashboard!");
        } else {
            console.error("❌ [OpsGuardian] Failed to report crash:", response.statusText);
        }
    } catch (reportError) {
        console.error("❌ [OpsGuardian] Network error while reporting:", reportError.message);
    }

    res.status(500).json({ status: "error", message: "Internal Server Error. Our team has been notified via OpsGuardian." });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
