"use client";
import { useState, useEffect } from "react";
import { File, Folder, Save, ChevronRight, FileCode, FileText, X, Plus, Upload, Trash2, Settings } from "lucide-react";

type FileItem = { name: string; isDir: boolean };

export default function FileManager({ instanceId }: { instanceId: string }) {
  const [currentPath, setCurrentPath] = useState("/app");
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
        const lines = data.output.split("\n").slice(3);
        const parsed = lines.filter((l: string) => l.length > 0).map((l: string) => {
          const parts = l.split(/\s+/);
          const name = parts.slice(8).join(" ");
          const isDir = l.startsWith("d");
          return { name, isDir };
        }).filter((f: FileItem) => f.name !== "." && f.name !== "..");
        setFiles(parsed);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function openFile(name: string, isDir: boolean) {
    if (isDir) { setCurrentPath(`${currentPath}/${name}`); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/files/${instanceId}/read?path=${currentPath}/${name}`);
      const data = await res.json();
      setFileContent(data.content || "");
      setSelectedFile(name);
    } finally { setLoading(false); }
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
      alert("File Saved!");
    } finally { setLoading(false); }
  }

  async function createFile() {
    const name = prompt("Enter file name:");
    if (!name) return;
    await fetch(`/api/proxy/files/${instanceId}/create`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: `${currentPath}/${name}` }),
    });
    loadFiles();
  }

  async function deleteFile(name: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete ${name}?`)) return;
    await fetch(`/api/proxy/files/${instanceId}/delete`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: `${currentPath}/${name}` }),
    });
    loadFiles();
  }

  useEffect(() => { loadFiles(); }, [currentPath]);

  // আইকন সিলেক্টর
  const getFileIcon = (name: string) => {
    if (name.endsWith(".py")) return <span className="text-yellow-400">🐍</span>;
    if (name.endsWith(".json")) return <Settings size={16} className="text-cyan-400" />;
    if (name.endsWith(".txt")) return <FileText size={16} className="text-slate-400" />;
    return <FileCode size={16} className="text-blue-400" />;
  };

  return (
    <div className="flex h-full bg-[#0d1117] text-slate-300 font-sans">
      
      {/* সাইডবার */}
      <div className="w-56 bg-[#161b22] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">Explorer</div>
        <div className="p-2 flex-1">
          <div className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 rounded-lg cursor-pointer text-indigo-400" onClick={() => setCurrentPath("/app")}>
            <Folder size={16} className="text-indigo-400" /> /app
          </div>
        </div>
      </div>

      {/* মেইন ফাইল লিস্ট */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        <div className="p-4 flex gap-3 border-b border-white/5">
          <button onClick={createFile} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-all">
            <Plus size={16} /> New File
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-all">
            <Upload size={16} /> Upload
          </button>
        </div>

        <div className="p-3 bg-[#161b22] text-xs font-mono text-slate-400 border-b border-white/5">
          <span className="text-indigo-400">~/</span>{currentPath}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading && <div className="p-4 text-xs text-slate-500">Loading...</div>}
          {files.map((f) => (
            <div key={f.name} onClick={() => openFile(f.name, f.isDir)}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer mb-1 transition-all ${selectedFile === f.name ? "bg-indigo-500/20 text-indigo-300" : "hover:bg-white/5"}`}>
              <div className="flex items-center gap-3">
                {f.isDir ? <Folder size={18} className="text-yellow-400 fill-yellow-400/20" /> : getFileIcon(f.name)}
                {f.name}
              </div>
              <button onClick={(e) => deleteFile(f.name, e)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* এডিটর */}
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
              <div className="flex items-center gap-2 text-sm">{getFileIcon(selectedFile)} {selectedFile}</div>
              <div className="flex gap-2">
                <button onClick={saveFile} disabled={loading} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg font-medium transition-all">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setSelectedFile(null)} className="p-1.5 hover:bg-white/10 rounded-lg"><X size={16} /></button>
              </div>
            </div>
            <textarea value={fileContent} onChange={(e) => setFileContent(e.target.value)}
              className="flex-1 w-full bg-[#0d1117] text-slate-300 font-mono text-sm p-4 outline-none resize-none" spellCheck={false} />
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
