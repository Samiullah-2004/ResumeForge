import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-3xl font-semibold">ResumeForge AI</h1>
      <p style={{ color: "var(--slate)" }}>Landing page coming soon.</p>
      <div className="flex gap-4">
        <Link href="/login" className="underline">Log in</Link>
        <Link href="/register" className="underline">Register</Link>
      </div>
    </main>
  );
}