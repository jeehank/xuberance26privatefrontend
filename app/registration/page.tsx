"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import FooterDeck from "@/components/sections/FooterDeck";
import Preloader from "@/components/preloader/Preloader";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.success && data.session) {
          if (data.session.role === "admin") {
            router.push("/registration/admin");
          } else {
            router.push("/registration/member");
          }
        } else {
          setIsCheckingSession(false);
        }
      } catch (err) {
        setIsCheckingSession(false);
      }
    };
    checkActiveSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Dispatch session change event for header reactivity
      window.dispatchEvent(new Event("session-change"));

      // Check role and redirect
      if (data.role === "admin") {
        router.push("/registration/admin");
      } else {
        router.push("/registration/member");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-slate-400 font-mono-custom">
        AUTHENTICATING...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full select-none overflow-x-hidden text-slate-100 bg-black">
      {/* Cinematic preloader skipping instantly */}
      <Preloader />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Form Area */}
        <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md p-8 md:p-10 rounded-3xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="font-orbitron text-2xl md:text-3xl font-black tracking-widest text-slate-100">
                PORTAL LOGIN
              </h2>
              <div className="w-16 h-0.5 bg-cyan-400 mx-auto mt-3" />
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl border border-red-500/25 bg-red-950/20 text-red-400 text-xs md:text-sm font-mono-custom text-center">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="flex flex-col space-y-2">
                <label className="font-orbitron text-sm font-bold text-white/80 tracking-widest uppercase">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="ENTER YOUR USERNAME..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="terminal-input font-mono-custom text-base bg-black border border-zinc-850 focus:border-cyan-400 focus:outline-none px-4 py-3 rounded-xl w-full text-slate-100"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label className="font-orbitron text-sm font-bold text-white/80 tracking-widest uppercase">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="ENTER YOUR PASSWORD..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="terminal-input font-mono-custom text-base bg-black border border-zinc-850 focus:border-cyan-400 focus:outline-none px-4 py-3 rounded-xl w-full text-slate-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 py-3 rounded-full bg-cyan-400 text-slate-950 hover:bg-white font-orbitron font-bold tracking-widest text-xs transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "AUTHENTICATING..." : "LOGIN"}
              </button>
            </form>
          </motion.div>
        </div>

        <FooterDeck />
      </div>
    </main>
  );
}
