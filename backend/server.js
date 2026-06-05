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

connectDB();

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

