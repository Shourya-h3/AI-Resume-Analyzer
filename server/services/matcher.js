const { analyzeTFIDF } = require('./tfidf');
const { extractSkills, computeSkillGap } = require('./skillExtractor');

/**
 * Generate improvement suggestions based on analysis results.
 */
const generateSuggestions = (matchScore, missingSkills, matchedSkills, jobTopTerms) => {
  const suggestions = [];

  // Score-based suggestions
  if (matchScore < 30) {
    suggestions.push('Your resume has low alignment with this job. Consider a significant rewrite targeting the job requirements.');
  } else if (matchScore < 50) {
    suggestions.push('Your resume partially matches the job. Focus on adding more relevant keywords and experiences.');
  } else if (matchScore < 70) {
    suggestions.push('Good alignment! Improve your resume by incorporating more specific skills and achievements mentioned in the job posting.');
  } else if (matchScore < 85) {
    suggestions.push('Strong match! Fine-tune your resume to highlight your most relevant experiences at the top.');
  } else {
    suggestions.push('Excellent match! Your resume is well-tailored for this position. Ensure all key achievements are quantified.');
  }

  // Missing skills suggestions
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 5);
    suggestions.push(`Add these missing skills to your resume: ${topMissing.join(', ')}.`);
  }

  if (missingSkills.length > 5) {
    suggestions.push(`Consider learning or gaining experience in: ${missingSkills.slice(5, 10).join(', ')}.`);
  }

  // Keyword suggestions from JD
  const missingKeywords = jobTopTerms.filter(
    (term) => !matchedSkills.map((s) => s.toLowerCase()).includes(term.toLowerCase())
  );
  if (missingKeywords.length > 0) {
    suggestions.push(`Incorporate these key job description terms: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }

  // General suggestions
  suggestions.push('Use action verbs like "developed", "led", "optimized", "architected", "delivered" to describe your experience.');
  suggestions.push('Quantify your achievements with metrics (e.g., "Improved performance by 40%", "Led a team of 5 engineers").');
  
  if (matchScore < 60) {
    suggestions.push('Tailor your resume summary/objective section to mirror the job title and core requirements.');
  }

  return suggestions.slice(0, 8); // Return top 8 suggestions
};

/**
 * Main matching function.
 * @param {string} resumeText
 * @param {string} jobText
 * @returns {Object} Full analysis result
 */
const analyzeMatch = (resumeText, jobText) => {
  // 1. TF-IDF cosine similarity
  const { similarity, resumeTopTerms, jobTopTerms } = analyzeTFIDF(resumeText, jobText);

  // 2. Convert to percentage (0-100), with slight normalization
  // Raw cosine on short docs can be low; scale by 1.15 but cap at 100
  const rawScore = Math.min(100, Math.round(similarity * 115));

  // 3. Skill extraction
  const resumeSkillResult = extractSkills(resumeText);
  const jobSkillResult = extractSkills(jobText);

  // 4. Skill gap
  const { matched, missing } = computeSkillGap(resumeSkillResult.skills, jobSkillResult.skills);

  // 5. Skill-based score component (bonus/penalty)
  let skillBonus = 0;
  if (jobSkillResult.skills.length > 0) {
    const skillMatchRatio = matched.length / jobSkillResult.skills.length;
    skillBonus = Math.round(skillMatchRatio * 20) - 10; // -10 to +10
  }

  const finalScore = Math.min(100, Math.max(0, rawScore + skillBonus));

  // 6. Skill breakdown
  const skillBreakdown = {
    technical: jobSkillResult.categories.technical.length > 0
      ? Math.round((resumeSkillResult.categories.technical.filter(s =>
          jobSkillResult.categories.technical.includes(s)).length
          / jobSkillResult.categories.technical.length) * 100)
      : 0,
    soft: jobSkillResult.categories.soft.length > 0
      ? Math.round((resumeSkillResult.categories.soft.filter(s =>
          jobSkillResult.categories.soft.includes(s)).length
          / jobSkillResult.categories.soft.length) * 100)
      : 0,
    tools: jobSkillResult.categories.tools.length > 0
      ? Math.round((resumeSkillResult.categories.tools.filter(s =>
          jobSkillResult.categories.tools.includes(s)).length
          / jobSkillResult.categories.tools.length) * 100)
      : 0,
    total: jobSkillResult.skills.length > 0
      ? Math.round((matched.length / jobSkillResult.skills.length) * 100)
      : 0,
  };

  // 7. Suggestions
  const suggestions = generateSuggestions(finalScore, missing, matched, jobTopTerms);

  return {
    matchScore: finalScore,
    matchedSkills: matched,
    missingSkills: missing,
    suggestions,
    skillBreakdown,
    topKeywords: {
      resume: resumeTopTerms,
      job: jobTopTerms,
    },
  };
};

module.exports = { analyzeMatch };
