"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import FooterDeck from "@/components/sections/FooterDeck";
import Preloader from "@/components/preloader/Preloader";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText, Download, Trash2, Edit3, Plus } from "lucide-react";
import { allEvents, type EventData } from "@/data/events";

interface Participant {
  name: string;
  number: string;
  class: string;
}

interface Registration {
  id: string;
  event_title: string;
  participants: Participant[];
  created_at: string;
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessionAndRegistrations();
  }, []);

  const fetchSessionAndRegistrations = async () => {
    try {
      // Fetch registrations (which also checks if member session is valid)
      const res = await fetch("/api/member/registrations");
      if (res.status === 401) {
        router.push("/registration");
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
        
        // Try to get username from session cookie or decode it
        // Since session is set HTTP-only, we can get basic user profile or just deduce it from registrations
        // Or we can query an endpoint if we need to. Let's just make a simple call or rely on state.
      } else {
        setError(data.error || "Failed to load registrations");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.dispatchEvent(new Event("session-change"));
      router.push("/registration");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const handleDeleteRegistration = async (eventTitle: string) => {
    const confirm = window.confirm(`Are you sure you want to delete your registration for "${eventTitle}"?`);
    if (!confirm) return;

    try {
      const res = await fetch(`/api/member/registrations?eventTitle=${encodeURIComponent(eventTitle)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete registration");
      } else {
        alert(`Successfully deleted registration for ${eventTitle}`);
        fetchSessionAndRegistrations(); // refresh
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert("You have no registrations to export yet.");
      return;
    }

    let csv = "\uFEFF"; // UTF-8 BOM

    registrations.forEach((reg) => {
      csv += `EVENT NAME: ${reg.event_title}\n`;
      csv += "PARTICIPANT NAME,PARTICIPANT NUMBER,CLASS\n";
      reg.participants.forEach((p) => {
        const name = `"${(p.name || "").replace(/"/g, '""')}"`;
        const number = `"${(p.number || "").replace(/"/g, '""')}"`;
        const className = `"${(p.class || "").replace(/"/g, '""')}"`;
        csv += `${name},${number},${className}\n`;
      });
      csv += "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `my_school_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to check if event is already registered
  const getRegisteredEvent = (title: string) => {
    return registrations.find((r) => r.event_title.toUpperCase() === title.toUpperCase());
  };

  if (isLoading && registrations.length === 0) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-slate-400 font-mono-custom">
        LOADING MEMBER DASHBOARD...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full select-none overflow-x-hidden text-slate-100 bg-black">
      <Preloader />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Member Layout */}
        <div className="flex-grow pt-32 pb-24 px-6 max-w-4xl mx-auto w-full flex flex-col">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
            <div>
              <h1 className="font-orbitron text-2xl md:text-3xl font-black tracking-widest uppercase text-slate-100">
                REGISTRATION PORTAL
              </h1>
              <p className="font-mono-custom text-xs text-cyan-400 mt-1 uppercase">
                Welcome back, School Representative
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/10 text-slate-300 hover:text-red-400 font-orbitron font-bold text-xs tracking-widest transition-all duration-300 cursor-pointer"
            >
              <LogOut size={13} />
              LOGOUT
            </button>
          </div>

          {/* Toggle View Registrations & Export */}
          <div className="mb-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setShowRegistrations(!showRegistrations)}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border border-zinc-800 bg-zinc-950 text-slate-200 font-orbitron font-bold text-xs tracking-widest transition-all duration-300 cursor-pointer hover:border-cyan-400 hover:text-cyan-450 hover:shadow-[0_0_15px_rgba(0,242,254,0.15)]"
            >
              <FileText size={14} />
              {showRegistrations ? "HIDE MY REGISTRATIONS" : "VIEW MY REGISTRATIONS"}
            </button>

            {registrations.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-white text-slate-950 font-orbitron font-bold text-xs tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.2)]"
              >
                <Download size={14} />
                CONVERT TO EXCEL
              </button>
            )}
          </div>

          {/* Registrations List Dropdown */}
          <AnimatePresence>
            {showRegistrations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-10 border border-zinc-900 bg-zinc-950/50 rounded-3xl p-6 md:p-8"
              >
                <h2 className="font-orbitron text-sm md:text-base font-bold tracking-widest uppercase text-cyan-400 mb-6 text-center border-b border-zinc-900/60 pb-3">
                  CURRENTLY REGISTERED EVENTS ({registrations.length})
                </h2>

                {registrations.length === 0 ? (
                  <p className="text-zinc-650 font-mono-custom text-xs uppercase text-center py-6">
                    You have not registered for any events yet. Complete registration forms below.
                  </p>
                ) : (
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                    {registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900/60 pb-5 last:border-b-0 last:pb-0 gap-4"
                      >
                        <div>
                          <span className="font-orbitron text-xs font-bold text-white uppercase tracking-wider block mb-2">
                            {reg.event_title}
                          </span>
                          <div className="space-y-0.5 font-mono-custom text-[11px] text-slate-400 pl-3 border-l border-zinc-800">
                            {reg.participants.map((p, idx) => (
                              <div key={idx}>
                                {p.name.toUpperCase()} | {p.number} | {p.class.toUpperCase()}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center">
                          <Link
                            href={`/registration/event/${encodeURIComponent(reg.event_title)}/edit`}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 font-orbitron font-extrabold text-[10px] tracking-widest transition-all duration-300"
                          >
                            <Edit3 size={11} />
                            EDIT
                          </Link>
                          <button
                            onClick={() => handleDeleteRegistration(reg.event_title)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 font-orbitron font-extrabold text-[10px] tracking-widest transition-all duration-300 cursor-pointer"
                          >
                            <Trash2 size={11} />
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Events List Title */}
          <div className="text-center mb-6">
            <h2 className="font-orbitron text-lg font-bold tracking-widest text-slate-200">
              AVAILABLE EVENTS FOR REGISTRATION
            </h2>
            <div className="w-12 h-0.5 bg-cyan-400 mx-auto mt-2" />
          </div>

          {/* Events List (In order, rectangles, no categories) */}
          <div className="space-y-4">
            {allEvents.map((event) => {
              const reg = getRegisteredEvent(event.title);
              return (
                <div key={event.title} className="w-full">
                  <Link
                    href={
                      reg
                        ? `/registration/event/${encodeURIComponent(event.title)}/edit`
                        : `/registration/event/${encodeURIComponent(event.title)}`
                    }
                    className="block"
                  >
                    <div className="relative w-full py-5 px-6 rounded-2xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900/40 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all duration-300 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_20px_rgba(0,242,254,0.08)] group">
                      <div className="flex-grow pr-4">
                        <span className="font-orbitron text-sm sm:text-base font-black tracking-widest uppercase block">
                          {event.title}
                        </span>
                        <span className="font-mono-custom text-[11px] text-zinc-500 group-hover:text-cyan-400/80 transition-colors duration-300 uppercase block mt-1">
                          {event.subtitle} — {event.description}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {reg ? (
                          <span className="px-3 py-1 rounded bg-cyan-500/10 border border-cyan-400/30 font-orbitron text-[9px] font-bold text-cyan-400 tracking-wider">
                            REGISTERED
                          </span>
                        ) : (
                          <span className="p-1.5 rounded-full bg-zinc-900 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300">
                            <Plus size={14} />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <FooterDeck />
      </div>
    </main>
  );
}
