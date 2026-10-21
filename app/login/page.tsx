"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setErr("ভুল email বা password");
    else router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
      <form onSubmit={submit} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-white mb-6">Welcome back</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-white font-semibold">
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-center text-slate-400 text-sm">
          Don&apos;t have an account? <Link href="/register" className="text-indigo-400 hover:underline">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
