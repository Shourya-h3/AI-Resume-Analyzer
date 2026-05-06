const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generates a tailored cover letter using the Google Gemini API.
 * 
 * @param {string} resumeText - The parsed text from the user's resume
 * @param {string} jobDescriptionText - The parsed text from the job description
 * @param {string} jobTitle - The title of the job
 * @returns {Promise<string>} - The generated cover letter
 */
const generateCoverLetter = async (resumeText, jobDescriptionText, jobTitle) => {
  // Check if API key is provided
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured in the environment variables.');
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert career coach and professional copywriter.
      Your task is to write a highly professional, engaging, and tailored cover letter for a job application.
      
      JOB TITLE: ${jobTitle}
      
      JOB DESCRIPTION:
      ${jobDescriptionText.substring(0, 3000)}
      
      CANDIDATE'S RESUME:
      ${resumeText.substring(0, 3000)}
      
      INSTRUCTIONS:
      1. Write a professional cover letter addressing the hiring manager.
      2. Highlight specific skills and experiences from the resume that directly align with the job description.
      3. Keep the tone enthusiastic, confident, and concise (max 3-4 paragraphs).
      4. Do not make up fake experiences or skills that are not in the resume. If the resume lacks certain skills, focus on the transferable skills they do have.
      5. Output ONLY the cover letter text, without any markdown formatting blocks like \`\`\` or extra conversational text.
      6. Provide placeholders like [Hiring Manager Name] or [Company Name] where appropriate.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate cover letter. Please try again later.');
  }
};

module.exports = { generateCoverLetter };
