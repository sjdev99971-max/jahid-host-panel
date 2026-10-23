"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function TerminalComponent({ instanceId }: { instanceId: string }) {
  const terminalRef = useRef<HTMLDivElement>(null);

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

    const wsUrl = `wss://server006.jahid.host/ws/terminal?id=${instanceId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      term.writeln("\x1b[32m✔ Connected to instance shell.\x1b[0m");
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onclose = () => {
      term.writeln("\r\n\x1b[31m✖ Connection closed.\x1b[0m");
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ws.close();
      term.dispose();
    };
  }, [instanceId]);

  return (
    <div className="w-full h-full bg-[#0d1117] p-2 rounded-b-xl overflow-hidden">
      <div ref={terminalRef} className="w-full h-full px-4 py-2" />
    </div>
  );
}
