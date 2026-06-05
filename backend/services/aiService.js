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

Return ONLY valid JSON.

{
  "patientName":"",
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

module.exports = extractClaimData;