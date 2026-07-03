import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="font-display text-lg font-semibold">
          ResumeForge <span style={{ color: "var(--teal)" }}>AI</span>
        </span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium" style={{ color: "var(--slate)" }}>
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-4 py-2 rounded text-white"
            style={{ background: "var(--teal)" }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <span className="font-mono text-xs tracking-wide" style={{ color: "var(--slate)" }}>
          FREE · POWERED BY AI
        </span>
        <h1 className="font-display text-5xl font-semibold mt-4 leading-tight">
          Stop rewriting the same resume for every job
        </h1>
        <p className="text-lg mt-5" style={{ color: "var(--slate)" }}>
          Paste a job description and upload your resume. Get a tailored version,
          a matching cover letter, and a match score — in seconds, not hours.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3 rounded font-medium text-white"
            style={{ background: "var(--teal)" }}
          >
            Tailor My Resume — Free
          </Link>
        </div>
      </section>

      {/* Before / After */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-center mb-2">
          See the difference
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: "var(--slate)" }}>
          Same experience. Written for the job you actually want.
        </p>

        <div
          className="rounded-lg p-8"
          style={{
            background: "var(--paper-raised)",
            border: "1px solid var(--border-hairline)",
          }}
        >
          <p className="font-mono text-xs mb-3" style={{ color: "var(--slate)" }}>
            BEFORE
          </p>
          <p className="text-sm mb-6">
            <span className="diff-strike">
              Responsible for building web applications using JavaScript and
              related tools.
            </span>
          </p>

          <p className="font-mono text-xs mb-3" style={{ color: "var(--slate)" }}>
            AFTER — tailored to a &quot;Senior Frontend Engineer, React&quot; posting
          </p>
          <p className="text-sm">
            <span className="diff-mark">
              Led development of high-traffic React applications, improving load
              performance by 40% through code-splitting and lazy loading.
            </span>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-center mb-12">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload your resume",
              body: "Drop in your PDF resume, or paste the text directly.",
            },
            {
              step: "02",
              title: "Paste the job description",
              body: "Copy the posting from wherever you found it.",
            },
            {
              step: "03",
              title: "Get your tailored result",
              body: "AI-rewritten resume, cover letter, and match score — ready to use.",
            },
          ].map((item) => (
            <div key={item.step}>
              <span
                className="font-mono text-sm font-medium"
                style={{ color: "var(--teal)" }}
              >
                {item.step}
              </span>
              <h3 className="font-display text-lg font-semibold mt-2 mb-2">
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--slate)" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold mb-4">
          Ready to stop rewriting resumes by hand?
        </h2>
        <Link
          href="/register"
          className="inline-block px-6 py-3 rounded font-medium text-white"
          style={{ background: "var(--teal)" }}
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 text-center text-sm"
        style={{ borderTop: "1px solid var(--border-hairline)", color: "var(--slate)" }}
      >
        Built by Sami · ResumeForge AI
      </footer>
    </main>
  );
}