"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error ?? "Something went wrong");
        return;
      }

      const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch {
      setServerError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="font-mono text-xs tracking-wide" style={{ color: "var(--slate)" }}>
            RESUMEFORGE AI
          </span>
          <h1 className="font-display text-3xl font-semibold mt-2">
            Welcome back
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg p-6 space-y-4"
          style={{
            background: "var(--paper-raised)",
            border: "1px solid var(--border-hairline)",
          }}
        >
          {serverError && (
            <div
              className="text-sm px-3 py-2 rounded"
              style={{ background: "rgba(255, 92, 122, 0.1)", color: "var(--redline)", border: "1px solid rgba(255, 92, 122, 0.3)" }}
              role="alert"
            >
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="font-mono text-xs" style={{ color: "var(--slate)" }}>
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2"
              style={{ borderColor: "var(--border-hairline)" }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: "var(--redline)" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="font-mono text-xs" style={{ color: "var(--slate)" }}>
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2"
              style={{ borderColor: "var(--border-hairline)" }}
            />
            {errors.password && (
              <p className="text-xs mt-1" style={{ color: "var(--redline)" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded py-2.5 font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: "var(--teal)" }}
          >
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: "var(--slate)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium" style={{ color: "var(--teal)" }}>
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
