const natural = require('natural');

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','are','was','were','be','been','being','have','has','had','do',
  'does','did','will','would','could','should','may','might','shall','can',
  'this','that','these','those','it','its','we','our','you','your','they',
  'their','he','his','she','her','i','me','my','us','am','not','no','so',
  'if','as','than','then','also','just','more','any','all','each','both',
  'about','into','through','during','before','after','above','below',
  'up','down','out','off','over','under','again','further','here','there',
  'when','where','why','how','what','which','who','whom', 'etc', 'per',
  'strong', 'experience', 'work', 'working', 'role', 'position', 'team',
  'ability', 'skills', 'skill', 'knowledge', 'understanding', 'excellent',
  'good', 'great', 'well', 'including', 'related', 'required', 'preferred',
  'must', 'need', 'needs', 'using', 'use', 'used', 'build', 'develop',
  'development', 'management', 'new', 'years', 'year'
]);

/**
 * Tokenize, clean, and remove stopwords from text.
 * @param {string} text
 * @returns {string[]}
 */
const tokenize = (text) => {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  return tokens.filter(
    (t) => t.length > 2 && !stopwords.has(t) && !/^\d+$/.test(t)
  );
};

/**
 * Build a TF-IDF term frequency map for a document within a corpus.
 * @param {string[]} tokens - Tokens for this document
 * @param {string[][]} corpus - Array of token arrays (all documents)
 * @returns {Object} - { term: tfidfScore }
 */
const buildTFIDFVector = (tokens, corpus) => {
  const N = corpus.length;
  const tfMap = {};

  // Term Frequency
  for (const token of tokens) {
    tfMap[token] = (tfMap[token] || 0) + 1;
  }
  const totalTerms = tokens.length;

  // Inverse Document Frequency
  const idfMap = {};
  const uniqueTerms = Object.keys(tfMap);
  for (const term of uniqueTerms) {
    const docsWithTerm = corpus.filter((doc) => doc.includes(term)).length;
    idfMap[term] = Math.log((N + 1) / (docsWithTerm + 1)) + 1; // smoothed
  }

  // TF-IDF score
  const tfidfVector = {};
  for (const term of uniqueTerms) {
    const tf = tfMap[term] / totalTerms;
    tfidfVector[term] = tf * idfMap[term];
  }

  return tfidfVector;
};

/**
 * Get top N terms by TF-IDF score.
 */
const getTopTerms = (vector, n = 15) => {
  return Object.entries(vector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([term]) => term);
};

/**
 * Compute cosine similarity between two TF-IDF vectors.
 */
const cosineSimilarity = (vecA, vecB) => {
  const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const term of allTerms) {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Main TF-IDF analysis function.
 * @param {string} resumeText
 * @param {string} jobText
 * @returns {{ similarity: number, resumeTopTerms: string[], jobTopTerms: string[] }}
 */
const analyzeTFIDF = (resumeText, jobText) => {
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobText);

  // Corpus = [resume, job]
  const corpus = [resumeTokens, jobTokens];

  const resumeVector = buildTFIDFVector(resumeTokens, corpus);
  const jobVector = buildTFIDFVector(jobTokens, corpus);

  const similarity = cosineSimilarity(resumeVector, jobVector);
  const resumeTopTerms = getTopTerms(resumeVector, 15);
  const jobTopTerms = getTopTerms(jobVector, 15);

  return { similarity, resumeTopTerms, jobTopTerms };
};

module.exports = { analyzeTFIDF, tokenize };
