"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Instance = {
  id: number; name: string; subdomain: string; plan: string;
  status: string; port: number | null;
};

export default function DashboardPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/proxy/instances");
      if (!r.ok) throw new Error(await r.text());
      const d = await r.json();
      setInstances(d.instances || []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function del(id: number, e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("Delete this instance?")) return;
    await fetch(`/api/proxy/instances/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Instances</h1>
          <p className="text-slate-400">Manage your deployed applications</p>
        </div>
        <Link href="/dashboard/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          + Deploy New Instance
        </Link>
      </div>

      {err && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
        Error: {err}
      </div>}

      {loading ? <p className="text-slate-400">Loading instances...</p> :
       instances.length === 0 ? (
         <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/10">
           <p className="text-5xl mb-4">📦</p>
           <h2 className="text-xl font-bold mb-2">No instances yet</h2>
           <p className="text-slate-400 mb-6">Deploy your first Python application now.</p>
           <Link href="/dashboard/new" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl">Create Instance</Link>
         </div>
       ) : (
         <div className="grid gap-4">
           {instances.map((i) => (
             <Link href={`/dashboard/instances/${i.id}`} key={i.id} 
               className="block bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all group">
               <div className="flex justify-between items-center">
                 <div>
                   <h3 className="text-xl font-semibold flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                     {i.name}
                   </h3>
                   <p className="text-slate-400 text-sm mt-1">
                     {i.plan === "outgoing_only" ? "🔒 Outgoing Only" : "🌐 Full Access"}
                     {i.port ? <> · <span className="text-indigo-400">{i.subdomain}.jahid.host</span></> : <> · No subdomain</>}
                   </p>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className={`text-xs px-3 py-1 rounded-full border ${i.status === "running" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                     {i.status.toUpperCase()}
                   </span>
                   <button onClick={(e) => del(i.id, e)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                     🗑️
                   </button>
                 </div>
               </div>
             </Link>
           ))}
         </div>
       )}
    </div>
  );
}
