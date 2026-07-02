import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { getAuthCookie } from "@/lib/auth-cookie";
import { verifyToken } from "@/lib/jwt";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB — plenty for a resume PDF

export async function POST(req: NextRequest) {
  const token = await getAuthCookie();
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File is too large (max 5MB)" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
    const { text } = await extractText(pdf, { mergePages: true });

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Couldn't extract readable text from this PDF. It might be a scanned image — try pasting the text manually instead.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    console.error("PDF parse error:", err);
    return NextResponse.json(
      { error: "Failed to read this PDF. Please try a different file." },
      { status: 500 }
    );
  }
}
