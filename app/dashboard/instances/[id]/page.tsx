"use client";
import { useState } from "react";
import { Terminal, Folder, Play, Globe, Settings } from "lucide-react";
import TerminalComponent from "@/app/components/TerminalComponent";

export default function InstanceManagePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("console");

  const tabs = [
    { id: "console", label: "Console", icon: <Terminal size={16} /> },
    { id: "files", label: "File Manager", icon: <Folder size={16} /> },
    { id: "startup", label: "Startup", icon: <Play size={16} /> },
    { id: "domain", label: "Domains & Port", icon: <Globe size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Instance Management</h1>
        <p className="text-slate-400">ID: {params.id} · <span className="text-emerald-400">Running</span></p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-white/10 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium rounded-t-lg transition-all ${
              activeTab === tab.id
                ? "bg-white/10 text-indigo-400 border-b-2 border-indigo-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 bg-[#0a0f1c] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
        
        {activeTab === "console" && (
          <div className="w-full h-full bg-[#0a0f1c]">
             <TerminalComponent instanceId={params.id} />
          </div>
        )}

        {activeTab === "files" && (
          <div className="p-8 text-center text-slate-400">
            <Folder size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-xl text-white mb-2">File Manager</h2>
            <p>Upload and edit files directly. (Coming soon)</p>
          </div>
        )}

        {activeTab === "domain" && (
          <div className="p-8 max-w-2xl">
            <h2 className="text-xl text-white mb-6">Domain & Port Routing</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold text-indigo-400 mb-2">Default Subdomain</h3>
                <div className="flex items-center gap-2">
                  <code className="bg-black px-3 py-1 rounded text-white">myapp.jahid.host</code>
                  <button className="text-xs bg-indigo-600 px-2 py-1 rounded">Copy</button>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold text-indigo-400 mb-2">Custom Domain (Nameserver Info)</h3>
                <p className="text-sm text-slate-400 mb-3">Point your domain to these nameservers:</p>
                <ul className="text-sm font-mono bg-black p-3 rounded border border-white/5">
                  <li>ns1.jahid.host (160.236.58.192)</li>
                  <li>ns2.jahid.host (160.236.58.192)</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold text-indigo-400 mb-2">Port Routing</h3>
                <p className="text-sm text-slate-400 mb-3">Map your domain to an internal port inside your container.</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. mydomain.com" className="flex-1 bg-black border border-white/10 rounded px-3 text-white" />
                  <input type="number" placeholder="Port (8000)" className="w-32 bg-black border border-white/10 px-3 text-white" />
                  <button className="bg-indigo-600 px-4 py-2 rounded font-medium">Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "startup" && (
          <div className="p-8 max-w-3xl">
            <h2 className="text-xl text-white mb-6">Startup Command</h2>
            <p className="text-slate-400 mb-4">This command will run automatically when the container starts.</p>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
              <label className="block text-sm text-slate-400 mb-2">Command</label>
              <input type="text" defaultValue="python app.py" className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white font-mono" />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded font-medium transition-all">Save Command</button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-8">
            <h2 className="text-xl text-white mb-6">Danger Zone</h2>
            <div className="border border-red-500/30 bg-red-500/5 p-4 rounded-lg flex justify-between items-center">
               <div>
                  <h3 className="font-semibold text-red-400">Delete Instance</h3>
                  <p className="text-sm text-slate-400">This action cannot be undone.</p>
               </div>
               <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-medium">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
