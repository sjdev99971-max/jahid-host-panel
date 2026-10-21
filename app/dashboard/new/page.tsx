"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANS, PlanId } from "@/lib/plans";

export default function NewInstancePage() {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [plan, setPlan] = useState<PlanId>("outgoing_only");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/proxy/instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subdomain, plan }),
      });
      if (!r.ok) throw new Error(await r.text());
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Instance</h1>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-sm mb-2 text-slate-300">Instance Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="my-python-app"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white" />
        </div>

        <div>
          <label className="block text-sm mb-2 text-slate-300">Subdomain</label>
          <div className="flex">
            <input value={subdomain} onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} required placeholder="myapp"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-l-lg text-white" />
            <span className="px-4 py-3 bg-slate-800 rounded-r-lg text-slate-400">.jahid.host</span>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-slate-300">Plan</label>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.values(PLANS).map((p) => (
              <label key={p.id}
                className={`border rounded-xl p-4 cursor-pointer ${plan === p.id ? "border-indigo-500 bg-indigo-500/10" : "border-slate-800 bg-slate-950"}`}>
                <input type="radio" className="hidden" checked={plan === p.id} onChange={() => setPlan(p.id as PlanId)} />
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-indigo-400">৳{p.price}/mo</span>
                </div>
                <p className="text-xs text-slate-400">RAM {p.ram} · CPU {p.cpu} · Disk {p.disk}</p>
              </label>
            ))}
          </div>
        </div>

        {err && <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg text-sm">{err}</div>}

        <button type="submit" disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg font-semibold">
          {loading ? "Creating..." : "Create Instance"}
        </button>
      </form>
    </div>
  );
}
