"use client";
import { useState } from "react";
import { Terminal, Folder, Play, Globe, Settings, ChevronLeft } from "lucide-react";
import TerminalComponent from "@/app/components/TerminalComponent";
import Link from "next/link";

export default function InstanceManagePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("console");

  const tabs = [
    { id: "console", label: "Console", icon: <Terminal size={18} /> },
    { id: "files", label: "Files", icon: <Folder size={18} /> },
    { id: "startup", label: "Startup", icon: <Play size={18} /> },
    { id: "domain", label: "Domain", icon: <Globe size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col animate-slide-up">
      
      {/* হেডার */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Manage Instance</h1>
            <p className="text-sm text-slate-400">ID: {params.id}</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-medium text-emerald-400">Running</span>
        </div>
      </div>

      {/* ট্যাব নেভিগেশন */}
      <div className="flex space-x-2 border-b border-white/10 mb-0 overflow-x-auto bg-white/[0.02] rounded-t-xl p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* কন্টেন্ট এরিয়া */}
      <div className="flex-1 bg-[#0d1117] border border-white/10 rounded-b-xl overflow-hidden shadow-2xl relative flex flex-col">
        
        {activeTab === "console" && (
          <div className="flex-1 flex flex-col w-full h-full">
            {/* Mac-স্টাইল উইন্ডো বার */}
            <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="mx-auto text-xs text-slate-500 font-mono">root@{params.id} ~ bash</span>
            </div>
            
            <div className="flex-1 relative">
              <TerminalComponent instanceId={params.id} />
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
            <Folder size={64} className="mb-4 opacity-20 text-indigo-400" />
            <h2 className="text-xl text-white mb-2">File Manager</h2>
            <p>Coming soon: Browse, upload, and edit files directly.</p>
          </div>
        )}

        {activeTab === "domain" && (
          <div className="p-8 max-w-2xl">
            <h2 className="text-xl text-white mb-6">Domain & Port Routing</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-indigo-400 mb-2">Default Subdomain</h3>
                <div className="flex items-center gap-2">
                  <code className="bg-black px-4 py-2 rounded-lg text-white font-mono">myapp.jahid.host</code>
                  <button className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg transition-colors">Copy</button>
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-indigo-400 mb-2">Custom Domain (Nameserver Info)</h3>
                <p className="text-sm text-slate-400 mb-3">Point your domain to these nameservers:</p>
                <ul className="text-sm font-mono bg-black p-4 rounded-lg border border-white/5 space-y-1">
                  <li>ns1.jahid.host (160.236.58.192)</li>
                  <li>ns2.jahid.host (160.236.58.192)</li>
                </ul>
              </div>

              <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-indigo-400 mb-2">Port Routing</h3>
                <p className="text-sm text-slate-400 mb-3">Map your domain to an internal port.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" placeholder="mydomain.com" className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  <input type="number" placeholder="Port (8000)" className="w-full sm:w-32 bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-medium transition-colors">Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "startup" && (
          <div className="p-8 max-w-3xl">
            <h2 className="text-xl text-white mb-6">Startup Command</h2>
            <p className="text-slate-400 mb-4">This command runs automatically on container start.</p>
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6">
              <label className="block text-sm text-slate-400 mb-2">Command</label>
              <input type="text" defaultValue="python app.py" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-indigo-500" />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg font-medium transition-colors">Save Changes</button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-8">
            <h2 className="text-xl text-white mb-6">Danger Zone</h2>
            <div className="border border-red-500/30 bg-red-500/5 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <h3 className="font-semibold text-red-400">Delete Instance</h3>
                  <p className="text-sm text-slate-400">This will permanently destroy the container and all data.</p>
               </div>
               <button className="bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap">Delete Instance</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
