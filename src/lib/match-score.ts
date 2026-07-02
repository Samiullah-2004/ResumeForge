/**
 * Calculates a simple keyword-overlap match score between a resume and a
 * job description. This is deliberately NOT AI-based — it's a cheap,
 * deterministic sanity check that runs instantly and costs nothing,
 * used alongside (not instead of) the AI-generated score.
 */
export function calculateKeywordMatchScore(
  resumeText: string,
  jobDescription: string
): number {
  const STOP_WORDS = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
    "this", "that", "these", "those", "you", "your", "we", "our", "will",
    "as", "it", "from", "have", "has", "had", "not", "can", "may",
  ]);

  function extractKeywords(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    );
  }

  const resumeWords = extractKeywords(resumeText);
  const jdWords = extractKeywords(jobDescription);

  if (jdWords.size === 0) return 0;

  let matchCount = 0;
  for (const word of jdWords) {
    if (resumeWords.has(word)) matchCount++;
  }

  return Math.round((matchCount / jdWords.size) * 100);
}
