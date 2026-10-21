import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white relative">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-20" />
      
      {/* গ্লোয়িং অরব */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-float" />

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto border-b border-white/5">
        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          🚀 JAHID HOST
        </span>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all">Login</Link>
          <Link href="/register" className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]">Sign up</Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-32 pb-20 animate-slide-up">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Supercharge Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Python Apps</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          মাত্র ৳৫০/মাস থেকে Python এপ্লিকেশন হোস্ট করুন। আল্ট্রা-ফাস্ট, ফুলি আইসোলেটেড, এবং ইনস্ট্যান্ট ডেপ্লয়মেন্ট।
        </p>
        <Link href="/register" className="inline-block px-10 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform duration-300">
          Get Started Now →
        </Link>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-6 py-10 pb-32">
        {Object.values(PLANS).map((p, idx) => (
          <div key={p.id} className={`bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${idx === 1 ? 'animate-glow border-indigo-500/30' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">{p.name}</h3>
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">{p.badge}</span>
            </div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">৳{p.price}</span>
              <span className="text-slate-400">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {p.features.map((f) => (
                <li key={f} className="flex items-center text-slate-300">
                  <span className="text-green-400 mr-2">✓</span> {f}
                </li>
              ))}
              <li className="flex items-center text-slate-400 text-sm pt-2 border-t border-white/10 mt-4">
                <span className="mr-2">⚡</span> RAM: {p.ram} | CPU: {p.cpu} | Disk: {p.disk}
              </li>
            </ul>
            <Link href="/register" className="block text-center w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-all">
              Deploy {p.name}
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
