"use client";

import { useAppStore } from "@/store/useAppStore";
import { X } from "lucide-react";

export default function TerminalHeader() {
  const setTerminalOpen = useAppStore((state) => state.setTerminalOpen);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-cyan-500/20 select-none">
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
        <button
          onClick={() => setTerminalOpen(false)}
          className="w-3 h-3 rounded-full bg-[#00f2fe] hover:bg-white hover:shadow-[0_0_10px_#00f2fe] transition-all cursor-pointer"
        />
      </div>

      <div className="font-mono-custom text-[10px] md:text-xs text-cyan-400 font-bold tracking-widest uppercase">
        abyssal-shell v1.0.4 // REGISTRY
      </div>

      <div className="flex items-center space-x-4">
        <span className="hidden sm:inline font-mono-custom text-[9px] text-cyan-500/50 uppercase tracking-wider">
          LAT: 11.3733° N | LGT: 142.1996° E
        </span>
        <button
          onClick={() => setTerminalOpen(false)}
          className="text-cyan-500 hover:text-cyan-300 transition-colors p-0.5 rounded focus:outline-none hover:bg-cyan-950/20 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
