"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const reg = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!reg.ok) {
      const data = await reg.json();
      setErr(data.error || "Registration failed");
      setLoading(false);
      return;
    }
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setErr("Login failed after register");
    else router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
      <form onSubmit={submit} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-white mb-6">Create account</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
        <input type="password" placeholder="Password (6+ chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-white font-semibold">
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="text-center text-slate-400 text-sm">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:underline">Log in</Link>
        </p>
      </form>
    </main>
  );
}
