"use client";

import React, { useState, useEffect, use } from "react";
import Navbar from "@/components/navigation/Navbar";
import FooterDeck from "@/components/sections/FooterDeck";
import Preloader from "@/components/preloader/Preloader";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { allEvents } from "@/data/events";
import { getParticipantCount } from "@/lib/event-utils";

interface PageProps {
  params: Promise<{
    title: string;
  }>;
}

interface ParticipantInput {
  name: string;
  number: string;
  class: string;
}

export default function EditEventRegistrationPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const eventTitle = decodeURIComponent(resolvedParams.title);

  // Find the event details
  const event = allEvents.find(
    (e) => e.title.toUpperCase() === eventTitle.toUpperCase()
  );

  const participantCount = event ? getParticipantCount(event.participants) : 1;

  // States
  const [participants, setParticipants] = useState<ParticipantInput[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Check session and load existing registration details
  useEffect(() => {
    const fetchExistingRegistration = async () => {
      try {
        const res = await fetch("/api/member/registrations");
        if (res.status === 401) {
          router.push("/registration");
          return;
        }

        const data = await res.json();
        if (data.success) {
          const list = data.registrations || [];
          const existing = list.find(
            (r: any) => r.event_title.toUpperCase() === eventTitle.toUpperCase()
          );

          if (existing && existing.participants && existing.participants.length > 0) {
            // Fill with existing data
            const loadedFields = Array.from({ length: participantCount }).map((_, idx) => {
              const prev = existing.participants[idx];
              return {
                name: prev?.name || "",
                number: prev?.number || "",
                class: prev?.class || "",
              };
            });
            setParticipants(loadedFields);
          } else {
            // No existing registration found: fallback to empty fields
            const initialFields = Array.from({ length: participantCount }).map(() => ({
              name: "",
              number: "",
              class: "",
            }));
            setParticipants(initialFields);
          }
        } else {
          setError(data.error || "Failed to load registration details");
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to server");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchExistingRegistration();
  }, [eventTitle, participantCount, router]);

  const handleInputChange = (
    index: number,
    field: keyof ParticipantInput,
    value: string
  ) => {
    const updated = [...participants];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate all fields
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.name.trim() || !p.number.trim() || !p.class.trim()) {
        setError(`Please fill in all details for Participant ${i + 1}`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/member/registrations", {
        method: "POST", // API route automatically deletes previous matching row first
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: event?.title || eventTitle,
          participants,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update registration");
      } else {
        alert(`Successfully updated registration for ${event?.title || eventTitle}!`);
        router.push("/registration/member");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-slate-400 font-mono-custom">
        RETRIEVING REGISTRATION DATA...
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center text-slate-400 font-mono-custom p-6 text-center">
        <p className="mb-4">EVENT &quot;{eventTitle}&quot; NOT FOUND</p>
        <Link
          href="/registration/member"
          className="px-6 py-2 border border-zinc-800 rounded-full text-slate-200 hover:text-cyan-400 hover:border-cyan-400 transition-all text-xs"
        >
          RETURN TO DASHBOARD
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full select-none overflow-x-hidden text-slate-100 bg-black">
      <Preloader />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Form Container */}
        <div className="flex-grow pt-32 pb-24 px-6 max-w-2xl mx-auto w-full flex flex-col">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/registration/member"
              className="inline-flex items-center gap-2 text-zinc-550 hover:text-cyan-400 font-orbitron font-extrabold text-[10px] tracking-widest transition-colors duration-300"
            >
              <ArrowLeft size={12} />
              BACK TO DASHBOARD
            </Link>
          </div>

          {/* Event Info Header */}
          <div className="border-b border-zinc-900 pb-6 mb-8 text-center sm:text-left">
            <h1 className="font-orbitron text-xl md:text-2xl font-black tracking-widest text-slate-100 uppercase">
              EDIT REGISTRATION: {event.title}
            </h1>
            <p className="font-mono-custom text-xs text-cyan-400 mt-1.5 uppercase">
              {event.subtitle} — {event.participants} REQUIRED
            </p>
            <p className="font-sans text-xs md:text-sm text-slate-400 mt-3 leading-relaxed">
              {event.description}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/25 bg-red-950/20 text-red-400 text-xs md:text-sm font-mono-custom text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Dynamic Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {participants.map((p, idx) => (
                <div
                  key={idx}
                  className="p-5 md:p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4"
                >
                  <h3 className="font-orbitron text-xs font-extrabold text-cyan-400 tracking-wider uppercase mb-2 border-b border-zinc-900/60 pb-2">
                    Participant {idx + 1}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col space-y-1.5">
                      <label className="font-orbitron text-[10px] font-bold text-white/60 tracking-wider uppercase">
                        Participant Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ENTER FULL NAME..."
                        value={p.name}
                        onChange={(e) =>
                          handleInputChange(idx, "name", e.target.value)
                        }
                        className="bg-black border border-zinc-850 focus:border-cyan-400 focus:outline-none px-3.5 py-2.5 rounded-lg w-full text-slate-100 font-mono-custom text-xs"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col space-y-1.5">
                      <label className="font-orbitron text-[10px] font-bold text-white/60 tracking-wider uppercase">
                        Participant Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ENTER CONTACT NUMBER..."
                        value={p.number}
                        onChange={(e) =>
                          handleInputChange(idx, "number", e.target.value)
                        }
                        className="bg-black border border-zinc-850 focus:border-cyan-400 focus:outline-none px-3.5 py-2.5 rounded-lg w-full text-slate-100 font-mono-custom text-xs"
                      />
                    </div>
                  </div>

                  {/* Class */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-orbitron text-[10px] font-bold text-white/60 tracking-wider uppercase">
                      Class
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ENTER CLASS (E.G. 11-C, 12-A)..."
                      value={p.class}
                      onChange={(e) =>
                        handleInputChange(idx, "class", e.target.value)
                      }
                      className="bg-black border border-zinc-850 focus:border-cyan-400 focus:outline-none px-3.5 py-2.5 rounded-lg w-full text-slate-100 font-mono-custom text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-cyan-400 text-slate-950 hover:bg-white font-orbitron font-bold tracking-widest text-xs transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] disabled:opacity-50"
            >
              {isSubmitting ? "PROCESSING TRANSMISSION..." : "EDIT REGISTRATION"}
            </button>
          </form>
        </div>

        <FooterDeck />
      </div>
    </main>
  );
}
