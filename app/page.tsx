import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <span className="text-2xl font-bold">🚀 Jahid Host</span>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-white/10">Login</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700">Sign up</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-12">
        <h1 className="text-5xl font-extrabold mb-4">Mini VPS for Python Apps</h1>
        <p className="text-xl text-slate-300 mb-8">
          চালু করুন আপনার Python app মাত্র ৳50/মাস থেকে। Subdomain সহ, সম্পূর্ণ isolated।
        </p>
        <Link href="/register" className="inline-block px-8 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold">
          Get Started →
        </Link>
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 py-20">
        {Object.values(PLANS).map((p) => (
          <div key={p.id} className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">{p.name}</h3>
              <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">{p.badge}</span>
            </div>
            <p className="text-4xl font-extrabold mb-6">৳{p.price}<span className="text-base font-normal text-slate-400">/mo</span></p>
            <ul className="space-y-2 mb-6">
              {p.features.map((f) => <li key={f} className="text-slate-300">✓ {f}</li>)}
              <li className="text-slate-400 text-sm">RAM: {p.ram} · CPU: {p.cpu} · Disk: {p.disk}</li>
            </ul>
            <Link href="/register" className="block text-center w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold">
              Choose {p.name}
            </Link>
          </div>
        ))}
      </section>

      <footer className="text-center py-8 text-slate-500 text-sm">
        © {new Date().getFullYear()} Jahid Host
      </footer>
    </main>
  );
}
