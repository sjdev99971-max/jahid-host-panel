"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Server, PlusCircle, LogOut, ShieldCheck } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const cookie = document.cookie.split("; ").find(row => row.startsWith("jahid_user="));
    if (cookie) {
      setUser(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">Loading...</div>;

  const isAdmin = user.email === "admin@jahid.host";

  const nav = [
    { href: "/dashboard", label: "My Instances", icon: <Server size={20} /> },
    { href: "/dashboard/new", label: "Deploy New", icon: <PlusCircle size={20} /> },
  ];

  if (isAdmin) {
    nav.push({ href: "/dashboard/admin", label: "Admin Panel", icon: <ShieldCheck size={20} /> });
  }

  function logout() {
    document.cookie = "jahid_token=; Max-Age=0; path=/";
    document.cookie = "jahid_user=; Max-Age=0; path=/";
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col md:flex-row relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712] pointer-events-none" />

      <aside className="w-full md:w-72 bg-white/[0.02] backdrop-blur-2xl border-r border-white/10 flex flex-col md:h-screen sticky top-0 z-50">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            🚀 Jahid Host
          </Link>
        </div>
        
        <nav className="p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {nav.map((n) => {
            const isActive = pathname === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 whitespace-nowrap px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" 
                    : "hover:bg-white/5 text-slate-400 hover:text-white"
                }`}>
                {n.icon} <span className="font-medium">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="hidden md:block mt-auto p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isAdmin ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
              {user?.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-xs text-slate-400">{isAdmin ? "Administrator" : "Pro User"}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
