const pdfParse = require('pdf-parse');

/**
 * Extract plain text from a PDF buffer.
 * @param {Buffer} buffer - The raw PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    // Clean up text: normalize whitespace, remove control chars
    const text = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[^\S\n]+/g, ' ')  // collapse spaces (not newlines)
      .replace(/\n{3,}/g, '\n\n') // max 2 consecutive newlines
      .trim();
    return text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

module.exports = { extractTextFromPDF };
