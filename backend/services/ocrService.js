const Tesseract = require("tesseract.js");
const path = require("path");

const extractText = async (filePath) => {
  try {
    const result = await Tesseract.recognize(
      filePath,
      "eng",
      {
        // Point to the local eng.traineddata file bundled in the repo
        langPath: path.join(__dirname, "../../"),
        logger: m => {
          if (m.status === "recognizing text") {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    console.log("OCR extracted text length:", result.data.text.length);
    return result.data.text;
  } catch (error) {
    console.error("OCR Error:", error.message);
    throw error;
  }
};

module.exports = extractText;