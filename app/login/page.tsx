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
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setErr("লগইন ফেইল হয়েছে! পাসওয়ার্ড ভুল অথবা VPS কানেক্ট হচ্ছে না।");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setErr("সার্ভার এরর!");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030712] px-6">
      <form onSubmit={submit} className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Welcome Back</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full px-5 py-4 mb-4 bg-black/40 border border-white/10 rounded-xl text-white" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full px-5 py-4 mb-4 bg-black/40 border border-white/10 rounded-xl text-white" />
        {err && <p className="text-red-400 text-sm mb-4">{err}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white font-bold">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
