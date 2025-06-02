// PUBLIC_INTERFACE
export function parseGeminiQuizResponse(result) {
  // Parses Gemini API response to extract quiz question, options, answer, explanation (if any)
  try {
    const candidates = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    // Expected: JSON or formatted string output (depends on the prompt to Gemini)
    // Example parser: you may want to enforce question structure on AI prompt
    if (!candidates) return null;
    // Try to JSON.parse first, fallback to text split
    try {
      return JSON.parse(candidates);
    } catch {
      // fallback: parse string format
      return candidates;
    }
  } catch (err) {
    return null;
  }
}
