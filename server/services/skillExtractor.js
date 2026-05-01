const skillsData = require('../data/skills.json');

// Flatten all skills into a single array (lowercase)
const allSkills = [
  ...skillsData.technical,
  ...skillsData.soft,
  ...skillsData.tools,
].map((s) => s.toLowerCase().trim());

// Build category map for skill breakdown
const categoryMap = {};
skillsData.technical.forEach((s) => { categoryMap[s.toLowerCase().trim()] = 'technical'; });
skillsData.soft.forEach((s) => { categoryMap[s.toLowerCase().trim()] = 'soft'; });
skillsData.tools.forEach((s) => { categoryMap[s.toLowerCase().trim()] = 'tools'; });

/**
 * Normalize text for skill matching.
 */
const normalizeText = (text) => text.toLowerCase().replace(/[^a-z0-9\s.#+]/g, ' ').trim();

/**
 * Extract skills from a text string by matching against the taxonomy.
 * Uses longest-match-first to avoid partial duplicates (e.g. "node" vs "node.js").
 * @param {string} text
 * @returns {{ skills: string[], categories: {technical: string[], soft: string[], tools: string[]} }}
 */
const extractSkills = (text) => {
  const normalized = normalizeText(text);

  // Sort skills longest first so multi-word skills match before substrings
  const sortedSkills = [...allSkills].sort((a, b) => b.length - a.length);

  const found = new Set();

  for (const skill of sortedSkills) {
    // Use word boundary awareness: skill must appear as a whole token
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-z0-9.#])${escapedSkill}(?![a-z0-9.#])`, 'i');
    if (regex.test(normalized)) {
      found.add(skill);
    }
  }

  const skills = Array.from(found);

  // Build category breakdown
  const categories = { technical: [], soft: [], tools: [] };
  for (const skill of skills) {
    const cat = categoryMap[skill];
    if (cat && categories[cat]) {
      categories[cat].push(skill);
    }
  }

  return { skills, categories };
};

/**
 * Compute skill gap: which skills from JD are missing in resume
 */
const computeSkillGap = (resumeSkills, jobSkills) => {
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const matched = jobSkills.filter((s) => resumeSet.has(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !resumeSet.has(s.toLowerCase()));
  return { matched, missing };
};

module.exports = { extractSkills, computeSkillGap, normalizeText };
