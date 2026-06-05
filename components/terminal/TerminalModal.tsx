"use client";

import { useAppStore } from "@/store/useAppStore";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TerminalHeader from "./TerminalHeader";
import confetti from "canvas-confetti";

const bootLines = [
  "INITIALIZING SECURE ABYSSAL DEPLOYMENT LAYER...",
  "ESTABLISHING COHERENT ACOUSTIC SIGNAL LINK...",
  "PINGING CENTRAL CHALLENGER DEEP NET NODE [11.3733° N, 142.1996° E]...",
  "SIGNAL RATING: 98.4% // LINK STABILITY SECURE.",
  "SYS_OP: PREPARE TELEMETRY DATA INJECTION..."
];

export default function TerminalModal() {
  const { isTerminalOpen, setTerminalOpen } = useAppStore();
  const [formData, setFormData] = useState({ name: "", email: "", track: "HYDRO-NET HACKING" });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  const { displayedLines, isCompleted: bootCompleted } = useTypingEffect(bootLines, 20, isTerminalOpen);

  const submissionLines = [
    "[INFO] COMPILING BIOLUMINESCENT REGISTRY ARCHIVE...",
    "[INFO] COMPRESSING TELEMETRY HEADER NODES...",
    "[INFO] UPLOADING DATA BLOCK VIA ULTRASONIC MODEM...",
    "[SUCCESS] TRANSMISSION ACKNOWLEDGED BY ABYSSAL GATEWAY.",
    "[INFO] WELCOME PROTOCOL SENT TO REGISTERED MAILBOX."
  ];

  useEffect(() => {
    if (isTerminalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTerminalOpen]);

  useEffect(() => {
    if (!submitting) return;

    if (logIndex < submissionLines.length) {
      const timer = setTimeout(() => {
        setSubmitLogs((prev) => [...prev, submissionLines[logIndex]]);
        setLogIndex((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setSubmitSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00f2fe", "#4facfe", "#0dffd6", "#ffffff"]
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [submitting, logIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitting(true);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", track: "HYDRO-NET HACKING" });
    setSubmitting(false);
    setSubmitSuccess(false);
    setSubmitLogs([]);
    setLogIndex(0);
    setTerminalOpen(false);
  };

  if (!isTerminalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !submitting && setTerminalOpen(false)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="glass-card w-full max-w-lg rounded-2xl overflow-hidden relative z-10 shadow-[0_20px_50px_rgba(0,242,254,0.15)] border border-cyan-400/30"
        >
          <TerminalHeader />

          <div className="p-6 bg-slate-950/90 font-mono-custom text-xs md:text-sm text-cyan-400 min-h-[380px] flex flex-col justify-between">
            <div className="space-y-1.5 min-h-[110px] text-cyan-400/80">
              {displayedLines.map((line, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-cyan-500/50 mr-2">&gt;</span>
                  <span>{line}</span>
                </div>
              ))}
              {!bootCompleted && (
                <span className="inline-block w-2 h-4 bg-cyan-400 animate-[pulse_0.8s_infinite] ml-1" />
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center my-6">
              <AnimatePresence mode="wait">
                {bootCompleted && !submitting && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="text-cyan-300 font-bold uppercase tracking-wider mb-2 border-b border-cyan-500/10 pb-1">
                      // INPUT TELEMETRY DATA
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] text-cyan-500/60 uppercase tracking-widest">
                        PILOT NAME
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="ENTER FULL COGNOMEN..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="terminal-input"
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] text-cyan-500/60 uppercase tracking-widest">
                        PILOT SIGNAL (EMAIL)
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="ENTER COMMUNICATIONS NODE..."
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="terminal-input"
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] text-cyan-500/60 uppercase tracking-widest">
                        MISSION SECTOR (TRACK)
                      </label>
                      <select
                        value={formData.track}
                        onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                        className="bg-slate-900 border border-cyan-500/20 text-[#0dffd6] focus:border-cyan-400 focus:outline-none py-1.5 px-2 rounded font-mono-custom cursor-pointer"
                      >
                        <option value="HYDRO-NET HACKING">HYDRO-NET HACKING</option>
                        <option value="BIOLUMINESCENCE SYNTHESIS">BIOLUMINESCENCE SYNTHESIS</option>
                        <option value="ABYSSAL TELEMETRY">ABYSSAL TELEMETRY</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded border-2 border-[#0dffd6] hover:bg-[#0dffd6]/10 font-bold uppercase tracking-widest text-[#0dffd6] transition-colors focus:outline-none cursor-pointer"
                    >
                      TRANSMIT TARGET SIGNAL
                    </button>
                  </motion.form>
                )}

                {submitting && !submitSuccess && (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2 text-cyan-300 font-mono-custom text-xs"
                  >
                    <div className="text-cyan-400 font-bold uppercase tracking-wider mb-2 border-b border-cyan-500/10 pb-1">
                      // SECURE TRANSMISSION SEQUENCE
                    </div>
                    {submitLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="mr-2 text-cyan-400">&gt;&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    {logIndex < submissionLines.length && (
                      <div className="flex items-center space-x-2 text-cyan-500/60 animate-pulse mt-4">
                        <div className="w-1.5 h-3.5 bg-cyan-400" />
                        <span>SYNCHRONIZING BANDWIDTH METERS...</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 py-6"
                  >
                    <div className="text-4xl">🐋</div>
                    <h3 className="font-orbitron text-lg font-black text-cyan-300 tracking-wider">
                      TELEMETRY LOCKED
                    </h3>
                    <p className="text-slate-300 leading-relaxed max-w-sm mx-auto font-sans text-xs">
                      Welcome, <span className="font-bold text-cyan-400">{formData.name}</span>.
                      Your registration signal has been successfully hardcoded to the
                      Challenger Deep core registry for the <span className="font-bold text-cyan-400">{formData.track}</span> sector.
                    </p>
                    <button
                      onClick={handleReset}
                      className="mt-6 px-6 py-2 rounded bg-cyan-400 text-slate-950 font-orbitron font-bold tracking-widest text-[10px] hover:bg-white transition-colors cursor-pointer"
                    >
                      EXIT SHELL
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-cyan-500/10 pt-4 font-mono-custom text-[8px] text-cyan-500/40 select-none">
              <span>CRYPTO_MODE: ON // AES_256</span>
              <span>BUFFER_SIG: {submitting ? "UPLOADING" : "STABLE"}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
