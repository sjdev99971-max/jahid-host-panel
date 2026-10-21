"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  }
  if (!session) return null;

  const nav = [
    { href: "/dashboard", label: "Instances", icon: "🖥️" },
    { href: "/dashboard/new", label: "Create New", icon: "➕" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="text-xl font-bold">🚀 Jahid Host</Link>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className={`block px-4 py-3 rounded-lg hover:bg-slate-800 ${pathname === n.href ? "bg-slate-800" : ""}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <p className="text-sm text-slate-400 mb-2 truncate">{session.user?.email}</p>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
