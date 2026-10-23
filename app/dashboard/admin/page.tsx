"use client";
import { useEffect, useState } from "react";
import { Users, Server, Activity, ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [instances, setInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookie = document.cookie.split("; ").find(row => row.startsWith("jahid_user="));
    if (cookie) {
      const u = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
      setUser(u);
      if (u.email !== "admin@jahid.host") {
        window.location.href = "/dashboard";
      } else {
        fetchInstances();
      }
    }
  }, []);

  async function fetchInstances() {
    try {
      // আপাতত ডেমো ডাটা, কারণ অ্যাডমিন এন্ডপয়েন্ট ব্যাকএন্ডে বানানো হয়নি
      const res = await fetch("/api/proxy/instances"); 
      const data = await res.json();
      setInstances(data.instances || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.email !== "admin@jahid.host") {
    return <div className="text-red-500 p-8">Access Denied. Admins only.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="text-emerald-400" size={32} />
        <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Users size={24} /></div>
            <h3 className="text-slate-400 font-medium">Total Users</h3>
          </div>
          <p className="text-4xl font-bold text-white">12</p> {/* ডেমো নাম্বার */}
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Server size={24} /></div>
            <h3 className="text-slate-400 font-medium">Active Instances</h3>
          </div>
          <p className="text-4xl font-bold text-white">{instances.length || 2}</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Activity size={24} /></div>
            <h3 className="text-slate-400 font-medium">Server Load (RAM)</h3>
          </div>
          <p className="text-4xl font-bold text-white">46%</p> {/* ডেমো নাম্বার */}
        </div>
      </div>

      {/* All Instances Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">All Deployed Instances</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-white/5">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Subdomain</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
              ) : instances.map((i) => (
                <tr key={i.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono">#{i.id}</td>
                  <td className="px-6 py-4 text-white font-medium">{i.name}</td>
                  <td className="px-6 py-4">{i.subdomain}.jahid.host</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${i.plan === 'full_access' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {i.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
