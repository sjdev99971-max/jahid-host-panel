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
    if (res?.error) setErr("ভুল ইমেইল বা পাসওয়ার্ড!");
    else router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden px-6">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-float" />
      
      <form onSubmit={submit} className="relative z-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 w-full max-w-md shadow-2xl animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">Log in to manage your VPS</p>
        
        <div className="space-y-5">
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
        </div>
        
        {err && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">{err}</div>}
        
        <button type="submit" disabled={loading}
          className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all">
          {loading ? "Authenticating..." : "Log In"}
        </button>
        
        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
