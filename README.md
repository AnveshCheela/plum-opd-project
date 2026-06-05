# 🏥 Plum OPD — AI-Powered Claim Adjudication Tool

An intelligent full-stack web application that automates the adjudication (approval/rejection) of OPD insurance claims using AI-powered document processing and a policy-driven rule engine.

Built for the **Plum AI Automation Engineer Intern Assignment**.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://plum-opd.vercel.app *(update after deployment)* |
| **Backend API** | https://plum-opd.up.railway.app *(update after deployment)* |

---

## 🎯 What It Does

1. **User uploads** a medical document (bill/prescription) — JPG, PNG, or PDF
2. **OCR** (Tesseract.js) extracts raw text from the document
3. **Google Gemini 2.5 Flash** parses the text and extracts structured fields (patient name, diagnosis, doctor, medicines, claim amount, etc.)
4. **Rule engine** evaluates the claim against 8 policy rules in priority order
5. **Decision** is returned instantly — APPROVED / REJECTED / PARTIAL / MANUAL_REVIEW — with confidence score, approved amount, and reasons
6. **Result is stored** in MongoDB Atlas and visible in the claim history
7. **Admin Manual Adjudication Override**: Administrators can view claims flagged as `MANUAL_REVIEW` under a dedicated queue page and override them by manually approving (with a custom payout amount) or rejecting them (with custom reasons).

---

## 🎨 Monochromatic UI/UX Redesign
The interface has been fully updated to feature a **simple, elegant, and attractive black-and-white (monochromatic) theme** inspired by premium modern engineering dashboards:
* **Clean Typography**: Uses modern, readable sans-serif layout styling powered by `Inter`.
* **Monochrome Badges & Filters**: Replaced colorful red/green badges with high-contrast neutral capsules, dashed borders, and clear typographic weights.
* **Full-Width Navigation**: Styled with an aligned top header featuring the brand, role badges (`EMPLOYEE` / `ADMIN`), active status capsules, and an outline role switcher button.
* **Dynamic Grid Analytics**: Monochromatic bar chart representations and grid metrics styled in slate gray shades.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                   │
│  React 19 + Vite + React Router + Axios                 │
│                                                         │
│  Home → Upload Form → Result Page → Claim History       │
│                                   → Admin Review Queue  │
│                   ↕ REST API                            │
└─────────────────────┬───────────────────────────────────┘
                      │ POST /api/claims/upload
                      │ PUT /api/claims/:id/adjudicate
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Railway)                    │
│  Node.js + Express 5                                    │
│                                                         │
│  ┌─────────┐   ┌──────────────┐   ┌────────────────┐   │
│  │  Multer │──▶│ Tesseract.js │──▶│ Google Gemini  │   │
│  │ Upload  │   │  OCR Engine  │   │  2.5 Flash AI  │   │
│  └─────────┘   └──────────────┘   └───────┬────────┘   │
│                                           │             │
│                                           ▼             │
│                              ┌─────────────────────┐   │
│                              │   Rule Engine (8)   │   │
│                              │  1. Network Hospital │   │
│                              │  2. Fraud Detection  │   │
│                              │  3. Document Check   │   │
│                              │  4. Dental/Cosmetic  │   │
│                              │  5. Pre-Auth         │   │
│                              │  6. Waiting Period   │   │
│                              │  7. Coverage         │   │
│                              │  8. Claim Limits     │   │
│                              └──────────┬──────────┘   │
│                                         │               │
│                                         ▼               │
│                              ┌─────────────────────┐   │
│                              │    MongoDB Atlas     │   │
│                              │  (claims collection) │   │
│                              └─────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Test Cases Coverage

All 10 assignment test cases handled:

| TC | Scenario | Expected | Result |
|---|---|---|---|
| TC001 | Simple consultation ₹1,500 | APPROVED @ ₹1,350 | ✅ Pass |
| TC002 | Dental + cosmetic whitening | PARTIAL @ ₹8,000 | ✅ Pass |
| TC003 | Claim ₹7,500 > per-claim limit | REJECTED — PER_CLAIM_EXCEEDED | ✅ Pass |
| TC004 | Missing prescription / doctor reg | REJECTED — MISSING_DOCUMENTS | ✅ Pass |
| TC005 | Diabetes claim within 90-day waiting | REJECTED — WAITING_PERIOD | ✅ Pass |
| TC006 | Ayurvedic treatment ₹4,000 | APPROVED @ ₹4,000 (0% copay) | ✅ Pass |
| TC007 | MRI ₹15,000 without pre-auth | REJECTED — PRE_AUTH_MISSING | ✅ Pass |
| TC008 | 3 claims same day (fraud) | MANUAL_REVIEW | ✅ Pass |
| TC009 | Obesity / weight loss treatment | REJECTED — SERVICE_NOT_COVERED | ✅ Pass |
| TC010 | Apollo cashless ₹4,500 | APPROVED @ ₹3,600 (20% network discount) | ✅ Pass |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Axios |
| **Backend** | Node.js, Express 5 |
| **AI / LLM** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **OCR** | Tesseract.js 7 (with `eng.traineddata`) |
| **Database** | MongoDB Atlas (Mongoose 9) |
| **File Upload** | Multer |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Railway |

---

## 📁 Project Structure

```
plum-opd-project/
├── frontend/                    # React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation with role toggle & badge
│   │   │   ├── FileUpload.jsx   # Claim submission form
│   │   │   └── ClaimCard.jsx    # Claim history card
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── UploadClaim.jsx  # Upload page wrapper
│   │   │   ├── Result.jsx       # Adjudication result display
│   │   │   ├── ClaimHistory.jsx # Filterable claims list
│   │   │   ├── ReviewClaims.jsx # Admin manual review override page
│   │   │   ├── ReviewClaims.css # Admin review page styles
│   │   │   ├── Dashboard.jsx    # Admin analytics
│   │   │   └── PolicyTerms.jsx  # Policy terms accordion
│   │   ├── context/
│   │   │   └── RoleContext.jsx  # User/Admin role state
│   │   ├── services/
│   │   │   └── api.js           # Axios API client
│   │   └── data/
│   │       └── policy_terms.json
│   └── vercel.json              # SPA routing config
│
└── backend/                     # Node.js Express API
    ├── server.js                # Entry point + CORS config
    ├── config/
    │   └── db.js                # MongoDB connection
    ├── routes/
    │   └── claimRoutes.js       # API route definitions (upload, adjudicate)
    ├── services/
    │   ├── aiService.js         # Gemini LLM integration
    │   ├── ocrService.js        # Tesseract OCR
    │   ├── adjudicationService.js  # Rule engine orchestrator
    │   └── rules/
    │       ├── networkRules.js     # Rule 1: Network hospital cashless
    │       ├── fraudRules.js       # Rule 2: Fraud detection
    │       ├── documentRules.js    # Rule 3: Document validation
    │       ├── dentalRules.js      # Rule 4: Dental/cosmetic
    │       ├── preAuthRules.js     # Rule 5: Pre-authorization
    │       ├── waitingPeriodRules.js  # Rule 6: Waiting periods (date math)
    │       ├── coverageRules.js    # Rule 7: Coverage exclusions
    │       └── limitRules.js       # Rule 8: Per-claim limits
    ├── models/
    │   └── Claim.js             # Mongoose schema
    └── policy/
        └── policy_terms.json    # Policy configuration
```

---

## ⚙️ Adjudication Rule Engine

Rules are evaluated in priority order. The engine returns the **first matching non-approval** result:

| Priority | Rule | Condition | Decision |
|---|---|---|---|
| 1 | Network Hospital | Cashless request at Apollo/Fortis/Max/Manipal/Narayana | APPROVED (80% — 20% network discount) |
| 2 | Fraud Detection | >2 claims same day from same member | MANUAL_REVIEW |
| 3 | Document Validation | Missing doctor name, registration, or diagnosis | REJECTED |
| 4 | Dental/Cosmetic | Procedures include "whitening" | PARTIAL (covers dental, not cosmetic) |
| 5 | Pre-Authorization | MRI/CT Scan without pre-auth for >₹10,000 | REJECTED |
| 6 | Waiting Period | Diabetes/Hypertension within 90 days of join date | REJECTED (with eligible date) |
| 7 | Coverage Exclusion | Obesity, weight loss, cosmetic, experimental | REJECTED |
| 8 | Per-Claim Limit | Amount > ₹5,000 | REJECTED |
| Default | All checks passed | — | APPROVED (90% — 10% copay; 100% for alt medicine) |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/claims/upload` | Upload document → OCR → AI extraction → adjudicate → save |
| `POST` | `/api/claims/test` | Test adjudication with raw JSON (no OCR/AI) |
| `GET` | `/api/claims/` | Get all claims |
| `PUT` | `/api/claims/:id/adjudicate` | Update claim decision manually (Approve with amount / Reject with reasons) |
| `GET` | `/api/claims/stats` | Get dashboard statistics |

### POST `/api/claims/upload` — Request

```
Content-Type: multipart/form-data

document        File    (JPG/PNG/PDF)
memberId        String
memberName      String
claimAmount     Number
hospitalName    String
joinDate        String  (YYYY-MM-DD)
cashlessRequest Boolean
networkHospital Boolean
```

### POST `/api/claims/upload` — Response

```json
{
  "success": true,
  "extractedData": {
    "patientName": "Rajesh Kumar",
    "doctorName": "Dr. Sharma",
    "doctorRegistration": "KA/45678/2015",
    "diagnosis": "Viral fever",
    "treatmentDate": "2024-11-01",
    "claimAmount": 1500,
    "documentType": "prescription",
    "medicines": [{ "name": "Paracetamol", "dosage": "650mg", "duration": "5 days" }],
    "testsPrescribed": ["CBC", "Dengue test"],
    "procedures": []
  },
  "decision": {
    "decision": "APPROVED",
    "approvedAmount": 1350,
    "confidenceScore": 0.95,
    "rejectionReasons": [],
    "notes": "Approved at 90% after 10% copay deduction."
  }
}
```

---

## 🖥️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/plum-opd-project.git
cd plum-opd-project

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure backend environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### 3. Run locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev          # starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev          # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## ☁️ Deployment

### Backend → Railway

1. Push to GitHub
2. New Railway project → Deploy from GitHub → select repo
3. Set **Root Directory**: `backend`
4. Add environment variables: `MONGO_URI`, `GEMINI_API_KEY`, `FRONTEND_URL`
5. Railway auto-detects `npm start` as the start command
6. Copy the generated Railway domain

### Frontend → Vercel

1. New Vercel project → Import from GitHub
2. Set **Root Directory**: `frontend`, **Framework**: Vite
3. Add environment variable: `VITE_API_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app/api`
4. Deploy

---

## 📋 Assumptions Made

1. **Claim amount from form takes precedence** over OCR-extracted amount (form is more reliable)
2. **Alternative medicine** (Ayurveda, Homeopathy, Unani, Panchakarma) has 0% copay per policy terms
3. **Network hospital discount** is 20% applied to the full claim amount
4. **Waiting period** is calculated from `joinDate` provided in the form; if not provided, the system conservatively rejects
5. **Document validation** requires doctor name, doctor registration number, and diagnosis to all be present; a missing prescription means these fields won't be extractable
6. **Fraud check** uses the `previousClaimsSameDay` count passed from the form (ideally this would be queried from the DB)
7. **Confidence scores** are rule-based constants reflecting certainty of the specific rule trigger (not ML-computed)
8. **PDF support**: PDFs are processed via Tesseract OCR on the first page; scanned PDFs may have lower extraction quality
9. **Per-claim limit** of ₹5,000 applies after network discounts but before copay
10. **Partial approvals** (dental cosmetic) approve the non-cosmetic portion only

---

## 🔮 Potential Improvements

- **Real confidence scoring**: Calculate confidence from OCR quality + field completeness
- **RAG-based reasoning**: Use a vector store of past claims to improve decision accuracy
- **Fraud DB queries**: Query MongoDB for same-day claims instead of trusting client input
- **PDF text extraction**: Use `pdf-parse` for digital PDFs (better than OCR on text-based PDFs)
- **Multi-document upload**: Support submitting bills + prescriptions as separate files
- **Audit trail**: Track every rule evaluation with timestamps for compliance
- **Annual limit tracking**: Check cumulative YTD claims per member against ₹50,000 annual limit

---

## 👤 Author

Built by **Anvesh Cheela** for the Plum AI Automation Engineer Intern Assignment.
