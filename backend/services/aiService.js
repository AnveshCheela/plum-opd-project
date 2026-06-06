const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const extractClaimData = async (ocrText) => {
  try {
    const prompt = `
You are an insurance claim document parser.

Extract the following fields from the medical document.

Return ONLY valid JSON matching the following schema.

JSON Schema:
{
  "patientName":"",
  "hospitalName":"",
  "doctorName":"",
  "doctorRegistration":"",
  "diagnosis":"",
  "treatmentDate":"",
  "claimAmount":0,
  "documentType":"",
  "testsPrescribed":[],
  "procedures":[],
  "medicines":[
    {
      "name":"",
      "dosage":"",
      "duration":""
    }
  ]
}

### FEW-SHOT EXAMPLES ###

Example 1:
Input Raw OCR Text:
"DR. SHALINI SHARMA, MD DENTAL CLINIC
Reg No: 12345/A
Patient: John Doe, Age 32 Date: 12/04/2026
Diagnosis: Dental Caries
Procedures: Scaling, Tooth Whitening (Rs 5000)
Medicines: Paracetamol 500mg daily 3 days. Amoxicillin 250mg twice daily for 5 days.
Consultation fee: Rs 1500. Total Claim: 6500"

Output JSON:
{
  "patientName": "John Doe",
  "hospitalName": "DR. SHALINI SHARMA, MD DENTAL CLINIC",
  "doctorName": "DR. SHALINI SHARMA",
  "doctorRegistration": "12345/A",
  "diagnosis": "Dental Caries",
  "treatmentDate": "12/04/2026",
  "claimAmount": 6500,
  "documentType": "Receipt",
  "testsPrescribed": [],
  "procedures": ["Scaling", "Tooth Whitening"],
  "medicines": [
    {
      "name": "Paracetamol 500mg",
      "dosage": "daily",
      "duration": "3 days"
    },
    {
      "name": "Amoxicillin 250mg",
      "dosage": "twice daily",
      "duration": "5 days"
    }
  ]
}

Example 2:
Input Raw OCR Text:
"APOLLO HOSPITALS
Doctor: Dr. Ramesh Kumar, MBBS, MD
Registration: MC-6789
Date: 15-05-2026
Patient: Jane Smith
Diagnosis: Acute Gastritis
Tests: Blood test, Endoscopy
Procedures: None
Consultation & Medicines: Rs 3000"

Output JSON:
{
  "patientName": "Jane Smith",
  "hospitalName": "APOLLO HOSPITALS",
  "doctorName": "Dr. Ramesh Kumar",
  "doctorRegistration": "MC-6789",
  "diagnosis": "Acute Gastritis",
  "treatmentDate": "15-05-2026",
  "claimAmount": 3000,
  "documentType": "Prescription",
  "testsPrescribed": ["Blood test", "Endoscopy"],
  "procedures": [],
  "medicines": []
}

### END OF EXAMPLES ###

Document:
${ocrText}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(responseText);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const generateEmbedding = async (text) => {
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (err) {
    console.error("Embedding generation failed:", err.message);
    return [];
  }
};

module.exports = {
  extractClaimData,
  generateEmbedding
};