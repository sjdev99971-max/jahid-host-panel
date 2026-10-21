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

  async function del(id: number) {
    if (!confirm("Delete this instance?")) return;
    await fetch(`/api/proxy/instances/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Instances</h1>
        <Link href="/dashboard/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">+ Create Instance</Link>
      </div>

      {err && <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg mb-4">
        Backend error: {err}
      </div>}

      {loading ? <p className="text-slate-400">Loading...</p> :
       instances.length === 0 ? (
         <div className="text-center py-20 bg-slate-950 rounded-2xl border border-slate-800">
           <p className="text-4xl mb-4">📦</p>
           <p className="text-slate-400 mb-4">এখনো কোনো instance নেই</p>
           <Link href="/dashboard/new" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg">প্রথম instance বানাও</Link>
         </div>
       ) : (
         <div className="grid gap-4">
           {instances.map((i) => (
             <div key={i.id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex justify-between items-center">
               <div>
                 <h3 className="text-xl font-semibold">{i.name}</h3>
                 <p className="text-slate-400 text-sm">
                   {i.plan === "outgoing_only" ? "🔒 Outgoing Only" : "🌐 Full Access"}
                   {i.port ? <> · <a href={`http://${i.subdomain}.jahid.host`} target="_blank" className="text-indigo-400 hover:underline">{i.subdomain}.jahid.host</a></> : <> · No subdomain</>}
                 </p>
                 <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${i.status === "running" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                   {i.status}
                 </span>
               </div>
               <button onClick={() => del(i.id)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg">Delete</button>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}
