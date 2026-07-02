import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthCookie } from "@/lib/auth-cookie";
import { verifyToken } from "@/lib/jwt";
import { callGroqTailor } from "@/lib/groq";
import { calculateKeywordMatchScore } from "@/lib/match-score";

const tailorSchema = z.object({
  resumeText: z.string().min(50, "Resume text is too short"),
  jobDescription: z.string().min(50, "Job description is too short"),
});

export async function POST(req: NextRequest) {
  // Proxy already gates /tailor (the page), but this is an API route,
  // which proxy does NOT protect by default — so we verify auth here too.
  const token = await getAuthCookie();
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = tailorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { resumeText, jobDescription } = parsed.data;

    const [aiResult, keywordMatchScore] = await Promise.all([
      callGroqTailor(resumeText, jobDescription),
      Promise.resolve(calculateKeywordMatchScore(resumeText, jobDescription)),
    ]);

    return NextResponse.json({
      ...aiResult,
      keywordMatchScore, // non-AI fallback score, shown alongside the AI one
    });
  } catch (err) {
    console.error("Tailor error:", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
