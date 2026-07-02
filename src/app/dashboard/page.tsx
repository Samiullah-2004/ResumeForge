import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthCookie } from "@/lib/auth-cookie";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const token = await getAuthCookie();
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  const resumeCount = 0;

  return (
    <div className="min-h-screen">
      <Navbar userName={user.name} />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="font-mono text-xs tracking-wide" style={{ color: "var(--slate)" }}>
            DASHBOARD
          </span>
          <h1 className="font-display text-3xl font-semibold mt-2">
            Welcome, {user.name.split(" ")[0]}
          </h1>
        </div>

        {resumeCount === 0 ? (
          <div
            className="rounded-lg p-10 text-center"
            style={{
              background: "var(--paper-raised)",
              border: "1px dashed var(--border-hairline)",
            }}
          >
            <p className="font-display text-xl font-semibold mb-2">
              No tailored resumes yet
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--slate)" }}>
              Paste a job description and your resume to get your first{" "}
              <span className="diff-strike">generic</span>{" "}
              <span className="diff-mark">tailored</span> result.
            </p>
            <Link
              href="/tailor"
              className="inline-block rounded px-5 py-2.5 font-medium text-white"
              style={{ background: "var(--teal)" }}
            >
              Create your first tailored resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">{/* v2: resume history cards go here */}</div>
        )}
      </main>
    </div>
  );
}