"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const nav = [
    { href: "/dashboard", label: "Instances", icon: "🖥️" },
    { href: "/dashboard/new", label: "Create New", icon: "➕" },
  ];

  function logout() {
    document.cookie = "jahid_token=; Max-Age=0; path=/";
    document.cookie = "jahid_user=; Max-Age=0; path=/";
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col md:flex-row">
      
      {/* সাইডবার / মোবাইল টপ-বার */}
      <aside className="w-full md:w-64 bg-black/40 border-b md:border-r border-white/5 flex flex-col md:h-screen sticky top-0 z-50">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">🚀 Jahid Host</Link>
          <button onClick={logout} className="md:hidden text-red-400 text-sm bg-red-500/10 px-3 py-1 rounded">
            Logout
          </button>
        </div>
        
        <nav className="p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className={`whitespace-nowrap px-4 py-3 rounded-lg hover:bg-white/10 transition-all ${pathname === n.href ? "bg-white/10" : ""}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:block mt-auto p-4 border-t border-white/5">
          <p className="text-sm text-slate-400 mb-2 truncate">{user?.email}</p>
          <button onClick={logout} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition-all">
            Sign out
          </button>
        </div>
      </aside>

      {/* মেইন কনটেন্ট */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
