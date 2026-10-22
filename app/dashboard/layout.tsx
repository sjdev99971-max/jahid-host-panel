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

  if (!user) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;

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
    <div className="min-h-screen bg-[#030712] text-white flex">
      <aside className="w-64 bg-black/40 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-xl font-bold">🚀 Jahid Host</Link>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className={`block px-4 py-3 rounded-lg hover:bg-white/10 ${pathname === n.href ? "bg-white/10" : ""}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <p className="text-sm text-slate-400 mb-2 truncate">{user?.email}</p>
          <button onClick={logout} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition-all">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
