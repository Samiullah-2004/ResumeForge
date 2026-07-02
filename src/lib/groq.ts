const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

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

export async function callGroqTailor(
  resumeText: string,
  jobDescription: string
): Promise<TailorResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables");
  }

  const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const rawText: string | undefined = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("Groq API returned an empty response");
  }

  let parsed: TailorResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("Groq API returned malformed JSON");
  }

  return parsed;
}