const Tesseract = require("tesseract.js");

const extractText = async (filePath) => {
  try {
    const result = await Tesseract.recognize(
      filePath,
      "eng"
    );

    return result.data.text;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = extractText;