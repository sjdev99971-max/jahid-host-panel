"use client";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function TerminalComponent({ instanceId }: { instanceId: string }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "'Fira Code', 'Courier New', monospace",
      fontSize: 14,
      theme: {
        background: "#0d1117",
        foreground: "#c9d1d9",
        cursor: "#58a6ff",
        selectionBackground: "#3b5070",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    let ws: WebSocket | null = null;
    let retryCount = 0;

    function connect() {
      // URL এখানে আছে, কিন্তু কনসোলে প্রিন্ট হবে না
      const wsUrl = `wss://server006.jahid.host/ws/terminal?id=${instanceId}`;
      ws = new WebSocket(wsUrl);
      
      term.writeln(`\x1b[33m⏳ Connecting...\x1b[0m`);
      setStatus("connecting");

      ws.onopen = () => {
        term.writeln("\x1b[32m✔ Connected to instance shell.\x1b[0m\r\n");
        setStatus("connected");
        retryCount = 0;
      };

      ws.onmessage = (event) => {
        term.write(event.data);
      };

      ws.onclose = (e) => {
        setStatus("disconnected");
        if (e.wasClean) {
          term.writeln("\r\n\x1b[31m✖ Disconnected.\x1b[0m");
        } else {
          term.writeln("\r\n\x1b[31m✖ Connection lost. Retrying...\x1b[0m");
          if (retryCount < 3) {
            retryCount++;
            setTimeout(connect, 2000);
          }
        }
      };

      ws.onerror = () => {
        term.writeln("\r\n\x1b[31m⚠ Error: Unable to connect.\x1b[0m");
      };

      term.onData((data) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });
    }

    connect();

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ws) ws.close();
      term.dispose();
    };
  }, [instanceId]);

  return (
    <div className="w-full h-full bg-[#0d1117] p-2 overflow-hidden flex flex-col">
      <div className="flex justify-end px-2 pb-2">
        <span className={`text-xs px-2 py-1 rounded ${status === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <div ref={terminalRef} className="flex-1 w-full px-2" />
    </div>
  );
}
