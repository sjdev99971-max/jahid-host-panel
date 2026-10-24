"use client";
import { useState, useEffect } from "react";
import { File, Folder, Save, ChevronRight, FileCode, FileText, X } from "lucide-react";

export default function FileManager({ instanceId }: { instanceId: string }) {
  const [currentPath, setCurrentPath] = useState("/app");
  type FileItem = { name: string; isDir: boolean };
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/files/${instanceId}/list?path=${currentPath}`);
      const data = await res.json();
      if (data.output) {
        // ls -la আউটপুট পার্স করা
        const lines = data.output.split("\n").slice(3); // হেডার বাদ দেওয়া
        const parsed = lines.filter((l: string) => l.length > 0).map((l: string) => {
          const parts = l.split(/\s+/);
          const name = parts.slice(8).join(" ");
          const isDir = l.startsWith("d");
          return { name, isDir };
        }).filter((f: any) => f.name !== "." && f.name !== "..");
        setFiles(parsed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function openFile(name: string) {
    if (files.find(f => f.name === name)?.isDir) {
      setCurrentPath(`${currentPath}/${name}`);
      return;
    }
    setLoading(true);
    try {
      const fullPath = `${currentPath}/${name}`;
      const res = await fetch(`/api/proxy/files/${instanceId}/read?path=${fullPath}`);
      const data = await res.json();
      setFileContent(data.content || "");
      setSelectedFile(name);
    } finally {
      setLoading(false);
    }
  }

  async function saveFile() {
    if (!selectedFile) return;
    setLoading(true);
    try {
      await fetch(`/api/proxy/files/${instanceId}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `${currentPath}/${selectedFile}`, content: fileContent }),
      });
      alert("File saved successfully!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFiles(); }, [currentPath]);

  return (
    <div className="flex h-full bg-[#0d1117] text-slate-300 font-sans">
      {/* সাইডবার (বাম দিক) */}
      <div className="w-64 bg-[#161b22] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Explorer
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          <div 
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg cursor-pointer text-indigo-400"
            onClick={() => setCurrentPath("/app")}
          >
            <Folder size={16} className="text-indigo-400" /> /app
          </div>
        </div>
      </div>

      {/* ফাইল লিস্ট (মাঝখানে) */}
      <div className="w-72 border-r border-white/5 flex flex-col">
        <div className="p-3 border-b border-white/5 text-sm font-mono text-slate-500 flex items-center gap-1">
          <span className="text-indigo-400">~</span> {currentPath}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="p-4 text-xs text-slate-500">Loading...</div>}
          {!loading && files.length === 0 && <div className="p-4 text-xs text-slate-500">Empty folder</div>}
          {files.map((f: any) => (
            <div 
              key={f.name}
              onClick={() => openFile(f.name)}
              className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-white/5 ${selectedFile === f.name ? "bg-indigo-500/20 text-indigo-300" : ""}`}
            >
              {f.isDir ? <Folder size={16} className="text-yellow-400" /> : <FileCode size={16} className="text-blue-400" />}
              {f.name}
            </div>
          ))}
        </div>
      </div>

      {/* এডিটর (ডান দিক) */}
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <FileText size={16} className="text-blue-400" /> {selectedFile}
              </div>
              <div className="flex gap-2">
                <button onClick={saveFile} disabled={loading} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded transition-all">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setSelectedFile(null)} className="p-1.5 hover:bg-white/10 rounded">
                  <X size={16} />
                </button>
              </div>
            </div>
            <textarea 
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="flex-1 w-full bg-[#0d1117] text-slate-300 font-mono text-sm p-4 outline-none resize-none"
              spellCheck={false}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
             <FileCode size={64} className="mb-4 opacity-20" />
             <p>Select a file to edit</p>
          </div>
        )}
      </div>
    </div>
  );
}
