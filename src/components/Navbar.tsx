"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ userName }: { userName: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid var(--border-hairline)" }}
    >
      <Link href="/dashboard" className="font-display text-lg font-semibold">
        ResumeForge <span style={{ color: "var(--teal)" }}>AI</span>
      </Link>

      <div className="flex items-center gap-4">
        <span className="font-mono text-xs" style={{ color: "var(--slate)" }}>
          {userName}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-sm font-medium px-3 py-1.5 rounded transition-opacity disabled:opacity-60"
          style={{
            color: "var(--redline)",
            border: "1px solid var(--border-hairline)",
          }}
        >
          {loggingOut ? "Logging out…" : "Log out"}
        </button>
      </div>
    </nav>
  );
}