const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export type TailorResult = {
  summary: string;
  skills: string[];
  experience: { title: string; bullets: string[] }[];
  coverLetter: string;
  aiMatchScore: number;
};

const SYSTEM_INSTRUCTION = `You are a professional resume tailoring assistant. Given a candidate's resume and a job description, rewrite the resume content to emphasize the skills and experience most relevant to that specific job, and write a matching cover letter.

Respond with ONLY a JSON object in this exact shape, no markdown formatting, no code fences, no extra text:
{
  "summary": "a 2-3 sentence professional summary tailored to this job",
  "skills": ["skill1", "skill2", "..."],
  "experience": [{ "title": "job title / project name", "bullets": ["rewritten bullet point", "..."] }],
  "coverLetter": "a complete cover letter, 3-4 paragraphs",
  "aiMatchScore": 75
}

Keep the candidate's real experience truthful — rewrite framing and emphasis, do not invent employers, dates, or achievements that weren't in the original resume.`;

export async function callGeminiTailor(
  resumeText: string,
  jobDescription: string
): Promise<TailorResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const rawText: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Gemini API returned an empty response");
  }

  let parsed: TailorResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("Gemini API returned malformed JSON");
  }

  return parsed;
}
