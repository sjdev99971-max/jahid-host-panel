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
      theme: {
        background: "#0a0f1c",
        foreground: "#e2e8f0",
        cursor: "#6366f1",
        selectionBackground: "#334155",
      },
      fontFamily: "monospace",
      fontSize: 14,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    // Connect to WSS (WebSocket Secure)
    const wsUrl = `wss://server006.jahid.host/ws/terminal?id=${instanceId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      term.writeln("\x1b[32m✔ Connected to instance shell.\x1b[0m\r\n");
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

  return <div ref={terminalRef} className="w-full h-full p-2" />;
}
