"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type TailorResult = {
  summary: string;
  skills: string[];
  experience: { title: string; bullets: string[] }[];
  coverLetter: string;
  aiMatchScore: number;
  keywordMatchScore: number;
};

type Tab = "resume" | "cover-letter" | "score";

export default function TailorPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TailorResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("resume");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUserName(data.user.name);
      });
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    setIsParsingFile(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setParseError(data.error ?? "Could not read this file");
        setUploadedFileName(null);
        return;
      }

      setResumeText(data.text);
    } catch {
      setParseError("Could not reach the server. Please try again.");
      setUploadedFileName(null);
    } finally {
      setIsParsingFile(false);
      e.target.value = ""; // allow re-uploading the same file if needed
    }
  }

  async function handleSubmit() {
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      setResult(data);
      setActiveTab("resume");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    resumeText.trim().length >= 50 && jobDescription.trim().length >= 50;

  return (
    <div className="min-h-screen">
      <Navbar userName={userName} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="font-mono text-xs tracking-wide" style={{ color: "var(--slate)" }}>
            TAILOR
          </span>
          <h1 className="font-display text-3xl font-semibold mt-2">
            Tailor your resume
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left panel — input */}
          <div className="space-y-5">
            <div>
              <label className="font-mono text-xs" style={{ color: "var(--slate)" }}>
                JOB DESCRIPTION
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                placeholder="Paste the job description here…"
                className="mt-1 w-full rounded border px-3 py-2 outline-none resize-none"
                style={{
                  borderColor: "var(--border-hairline)",
                  background: "var(--paper-raised)",
                }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>
                {jobDescription.trim().length} characters (min 50)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs" style={{ color: "var(--slate)" }}>
                  YOUR RESUME
                </label>
                <label
                  className="text-xs font-medium px-3 py-1.5 rounded cursor-pointer"
                  style={{
                    background: "var(--marker)",
                    color: "var(--ink)",
                  }}
                >
                  {isParsingFile ? "Reading…" : "Upload PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    disabled={isParsingFile}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFileName && !parseError && (
                <p className="text-xs mt-1" style={{ color: "var(--teal)" }}>
                  ✓ Loaded from {uploadedFileName} — feel free to edit below
                </p>
              )}
              {parseError && (
                <p className="text-xs mt-1" style={{ color: "var(--redline)" }}>
                  {parseError}
                </p>
              )}

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Upload a PDF above, or paste your resume text here…"
                className="mt-1 w-full rounded border px-3 py-2 outline-none resize-none"
                style={{
                  borderColor: "var(--border-hairline)",
                  background: "var(--paper-raised)",
                }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>
                {resumeText.trim().length} characters (min 50)
              </p>
            </div>

            {error && (
              <div
                className="text-sm px-3 py-2 rounded"
                style={{ background: "#FCEAEA", color: "var(--redline)" }}
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full rounded py-2.5 font-medium text-white transition-opacity disabled:opacity-50"
              style={{ background: "var(--teal)" }}
            >
              {isSubmitting ? "Tailoring…" : "Tailor My Resume"}
            </button>
          </div>

          {/* Right panel — output */}
          <div>
            {!result && !isSubmitting && (
              <div
                className="h-full rounded-lg flex items-center justify-center p-10 text-center"
                style={{
                  border: "1px dashed var(--border-hairline)",
                  color: "var(--slate)",
                }}
              >
                <p className="text-sm">
                  Your tailored result will appear here after you submit.
                </p>
              </div>
            )}

            {isSubmitting && (
              <div
                className="h-full rounded-lg flex items-center justify-center p-10 text-center"
                style={{ border: "1px dashed var(--border-hairline)" }}
              >
                <p className="font-mono text-sm" style={{ color: "var(--slate)" }}>
                  Generating your tailored resume…
                </p>
              </div>
            )}

            {result && (
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  border: "1px solid var(--border-hairline)",
                  background: "var(--paper-raised)",
                }}
              >
                {/* Tabs */}
                <div className="flex" style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  {(
                    [
                      { key: "resume", label: "Tailored Resume" },
                      { key: "cover-letter", label: "Cover Letter" },
                      { key: "score", label: "Match Score" },
                    ] as { key: Tab; label: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className="flex-1 py-3 text-sm font-medium"
                      style={{
                        color: activeTab === tab.key ? "var(--teal)" : "var(--slate)",
                        borderBottom:
                          activeTab === tab.key
                            ? "2px solid var(--teal)"
                            : "2px solid transparent",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === "resume" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-mono text-xs mb-2" style={{ color: "var(--slate)" }}>
                          SUMMARY
                        </h3>
                        <p className="text-sm">{result.summary}</p>
                      </div>
                      <div>
                        <h3 className="font-mono text-xs mb-2" style={{ color: "var(--slate)" }}>
                          SKILLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded diff-mark"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-mono text-xs mb-2" style={{ color: "var(--slate)" }}>
                          EXPERIENCE
                        </h3>
                        <div className="space-y-4">
                          {result.experience.map((exp, i) => (
                            <div key={i}>
                              <p className="font-medium text-sm mb-1">{exp.title}</p>
                              <ul className="list-disc list-inside space-y-1">
                                {exp.bullets.map((bullet, j) => (
                                  <li key={j} className="text-sm" style={{ color: "var(--slate)" }}>
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "cover-letter" && (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {result.coverLetter}
                    </p>
                  )}

                  {activeTab === "score" && (
                    <div className="space-y-6">
                      <div>
                        <p className="font-mono text-xs mb-1" style={{ color: "var(--slate)" }}>
                          AI-ESTIMATED MATCH
                        </p>
                        <p className="font-display text-4xl font-semibold" style={{ color: "var(--teal)" }}>
                          {result.aiMatchScore}%
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-xs mb-1" style={{ color: "var(--slate)" }}>
                          KEYWORD OVERLAP (non-AI check)
                        </p>
                        <p className="font-display text-4xl font-semibold">
                          {result.keywordMatchScore}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
