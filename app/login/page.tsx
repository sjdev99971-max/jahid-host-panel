"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      // ৮ সেকেন্ডের টাইমআউট
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 8000)
      );

      const loginPromise = signIn("credentials", { 
        email, 
        password, 
        redirect: false 
      });

      const res: any = await Promise.race([loginPromise, timeoutPromise]);
      
      if (res?.error) {
        setErr("লগইন ফেইল! পাসওয়ার্ড ভুল অথবা ডাটাবেসে ইউজার নেই।");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      if (error.message === "Timeout") {
        setErr("সার্ভার রেসপন্স করছে না (Timeout)! NextAuth কনফিগারেশন চেক করুন।");
      } else {
        setErr("একটি অজানা সমস্যা হয়েছে!");
      }
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030712] px-6">
      <form onSubmit={submit} className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6">Welcome Back</h1>
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full px-5 py-4 mb-4 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500" />
        
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full px-5 py-4 mb-4 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500" />
        
        {err && <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{err}</p>}
        
        <button type="submit" disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white font-bold transition-all">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
