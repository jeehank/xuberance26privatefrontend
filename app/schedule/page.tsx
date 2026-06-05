"use client";

import { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import FooterDeck from "@/components/sections/FooterDeck";
import VideoBackground from "@/components/sections/VideoBackground";
import Preloader from "@/components/preloader/Preloader";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduleItem {
  event: string;
  subtitle?: string;
  venue: string;
  time: string;
}

const day1Schedule: ScheduleItem[] = [
  { event: "Registration", venue: "Front desk", time: "7:30 AM" },
  { event: "OPENING CEREMONY", venue: "Stage", time: "9:00 AM" },
  { event: "X-PULL", subtitle: "Tug Of War (Boys)", venue: "Senior School Main field", time: "11:00 AM" },
  { event: "X-SCRIPT", subtitle: "Creative Writing", venue: "Reading room", time: "11:00 AM" },
  { event: "X-RAPPORTEUR", subtitle: "Vlogging & Journalism", venue: "School campus", time: "10:30 AM" },
  { event: "X-FIFA", subtitle: "Fifa", venue: "Fr. Bruylants Hall", time: "10:30 AM" },
  { event: "X-TORKOBITOROKO", subtitle: "Bengali Debate", venue: "Fr. Bruylants Hall", time: "3:00 PM" },
  { event: "X-SPRAY", subtitle: "Spray Painting", venue: "Primary School Gymnasium", time: "11:00 AM" },
  { event: "X-ACOUSTIC", subtitle: "Western Music", venue: "Stage", time: "4:00 PM" },
  { event: "X-PROSHNOTTOR", subtitle: "Bengali Quiz", venue: "Fr. Sassel Hall", time: "11:00 AM" },
  { event: "X-AVRITTI", subtitle: "Hindi Elocution", venue: "Fr. Sassel Hall", time: "2:00 PM" },
  { event: "X-PONG", subtitle: "Table Tennis (Boys & Girls)", venue: "Games room", time: "10:30 AM" },
  { event: "X-HACK", subtitle: "Hackathon", venue: "Computer lab", time: "10:30 AM" },
  { event: "X-INNOVATE", subtitle: "Shark Tank", venue: "Xavier Hall", time: "11:00 AM" },
  { event: "X-PUZZLE", subtitle: "Puzzle Game", venue: "Big Parlour", time: "10:30 AM" },
  { event: "X-COOK", subtitle: "Fireless Cooking", venue: "Big Parlour", time: "1:30 PM" },
  { event: "X-KHO", subtitle: "Kho-Kho (Boys)", venue: "Senior School Back field", time: "10:30 AM" },
];

const day2Schedule: ScheduleItem[] = [
  { event: "Registration", venue: "Front Desk", time: "7:30 AM" },
  { event: "X-PAINTING", subtitle: "Sketching", venue: "Art Room", time: "10:30 AM" },
  { event: "X-GOAL", subtitle: "Football (Boys)", venue: "Senior School Main Field", time: "8:30 AM" },
  { event: "X-PULL", subtitle: "Tug Of War (Girls)", venue: "Senior School Main Field", time: "2:00 PM" },
  { event: "X-GOAL", subtitle: "Football (Girls)", venue: "Senior School Back field", time: "9:00 AM" },
  { event: "X-HACK", subtitle: "Hackathon", venue: "Computer Lab", time: "8:30 AM" },
  { event: "X-MATE", subtitle: "Chess", venue: "Big Parlour", time: "9:00 AM" },
  { event: "X-PRESS", subtitle: "Poster Making", venue: "Big Parlour", time: "1:00 PM" },
  { event: "X-CALIBRE", subtitle: "Debate (POOL2)", venue: "Fr. Bruylants Hall", time: "8:30 AM" },
  { event: "X-60", subtitle: "One Minute to Fame", venue: "Fr. Bruylants Hall", time: "12:00 PM" },
  { event: "X-ACT", subtitle: "Ad Spoof", venue: "Stage", time: "8:30 AM" },
  { event: "X-RAGA", subtitle: "Eastern Music", venue: "Stage", time: "12:00 PM" },
  { event: "X-TRAVAGANCE", subtitle: "Western Dance", venue: "Stage", time: "4:00 PM" },
  { event: "X-CALIBRE", subtitle: "Debate (POOL1)", venue: "Fr. Sassel Hall", time: "8:30 AM" },
  { event: "X-QUIZITE", subtitle: "Quiz", venue: "Fr. Sassel Hall", time: "12:30 PM" },
  { event: "X-HOOP", subtitle: "Basketball (Girls & Boys)", venue: "Basketball Court", time: "8:30 AM" },
  { event: "X-BID", subtitle: "Cricket Auction", venue: "Reading Room", time: "8:30 AM" },
  { event: "X-NEGOTIUM", subtitle: "Business Event", venue: "Xavier Hall", time: "8:30 AM" },
  { event: "X-GOLPO", subtitle: "Bengali Story telling", venue: "Xavier Hall", time: "2:00 PM" },
  { event: "X-RAPPORTEUR", subtitle: "Vlogging & Journalism", venue: "School Campus", time: "8:30 AM" },
  { event: "X-PIXEL", subtitle: "Photography", venue: "School Campus", time: "8:30 AM" },
  { event: "X-HUNT", subtitle: "Treasure Hunt", venue: "School Campus", time: "10:00 AM" },
];

const day3Schedule: ScheduleItem[] = [
  { event: "Registration", venue: "Front Desk", time: "7:30 AM" },
  { event: "X-HIBIT", subtitle: "Display of Science Models", venue: "Physics Laboratory", time: "8:30 AM" },
  { event: "X-WICKET", subtitle: "Cricket", venue: "Senior School Main Field", time: "8:30 AM" },
  { event: "X-KHO", subtitle: "Kho Kho (Girls)", venue: "Senior School Back Field", time: "8:30 AM" },
  { event: "X-HOP", subtitle: "Dance Face Off", venue: "Primary School Gymnasium", time: "8:30 AM" },
  { event: "X-NATAK", subtitle: "Stage Play", venue: "Stage", time: "11:00 AM" },
  { event: "X-DIGI", subtitle: "Digital Art", venue: "Art room", time: "8:30 AM" },
  { event: "X-RAPPORTEUR", subtitle: "Vlogging & Journalism", venue: "Reading Room", time: "10:00 AM" },
  { event: "X-KOBITA", subtitle: "Bengali poem", venue: "Fr. Bruylants Hall", time: "8:30 AM" },
  { event: "X-ALAAP", subtitle: "Hindi Antakshari", venue: "Xavier Hall", time: "8:30 AM" },
  { event: "X-CHOLOCHITRO", subtitle: "Bengali Short Film", venue: "Xavier Hall", time: "11:00 AM" },
  { event: "X-KALA", subtitle: "Eastern Dance", venue: "Fr. Depelchin Auditorium", time: "8:30 AM" },
  { event: "X-VIBRANCE", subtitle: "Ethnic Display", venue: "Fr. Depelchin Auditorium", time: "12:00 PM" },
  { event: "X-TEMPORE", subtitle: "Extempore", venue: "Fr. Sassel Hall", time: "8:30 AM" },
  { event: "X-CALIBRE", subtitle: "Debate (Final)", venue: "Fr. Sassel Hall", time: "11:30 AM" },
  { event: "CLOSING CEREMONY", venue: "Fr. Depelchin Auditorium", time: "3:30 PM" },
];

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  const getSchedule = () => {
    switch (activeDay) {
      case 1:
        return { date: "10th July", items: day1Schedule };
      case 2:
        return { date: "11th July", items: day2Schedule };
      case 3:
        return { date: "12th July", items: day3Schedule };
    }
  };

  const { date, items } = getSchedule();

  return (
    <main className="relative min-h-screen w-full select-none overflow-x-hidden text-slate-100 bg-transparent">
      {/* Dynamic caustics background using public/bg.jpg */}
      <VideoBackground />

      {/* Cinematic preloader skipping instantly */}
      <Preloader />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Schedule Wrapper */}
        <div className="flex-grow pt-32 pb-24 px-6 max-w-4xl mx-auto w-full flex flex-col items-center">

          {/* Day Buttons Header */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-12">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day as 1 | 2 | 3)}
                className={`cybr-btn transition-transform active:scale-95 ${activeDay === day
                  ? "shadow-[0_0_20px_rgba(13,255,214,0.6)] ring-2 ring-[#0dffd6]"
                  : "opacity-60 hover:opacity-100"
                  }`}
              >
                Day {day}
                <span aria-hidden></span>
                <span aria-hidden className="cybr-btn__glitch">
                  Day {day}
                </span>
              </button>
            ))}
          </div>

          {/* Date Heading */}
          <motion.h2
            key={activeDay + "-date"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="kusanagi font-orbitron text-center text-4xl md:text-6xl font-black mb-12 uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            {date}
          </motion.h2>

          {/* Table Container */}
          <div className="w-full">
            {/* Desktop View */}
            <div className="hidden md:flex flex-col items-center gap-4 w-full">
              <AnimatePresence mode="popLayout">
                {items.map((item, idx) => (
                  <motion.div
                    key={"desktop-" + activeDay + "-" + item.event + "-" + idx}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="w-full flex justify-center"
                  >
                    <div className="events-frame w-full max-w-[580px]">
                      <div className="events">
                        {/* Venue label - slides up on hover */}
                        <div className="venue-block">
                          <p dangerouslySetInnerHTML={{ __html: item.venue }} />
                        </div>

                        {/* Event Name + Subtitle */}
                        <div className="flex flex-col items-center" style={{ transform: "skewX(15deg)" }}>
                          <h2 style={{ transform: "none" }}>{item.event}</h2>
                          {item.subtitle && (
                            <span style={{ fontFamily: "var(--font-seaweed), cursive", fontSize: "0.65rem", color: "#67e8f9", letterSpacing: "0.05em", marginTop: "2px" }}>
                              {item.subtitle}
                            </span>
                          )}
                        </div>

                        {/* Time label - slides down on hover */}
                        <div className="time-block">
                          <p>{item.time}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Mobile View */}
            <div className="flex flex-col gap-4 w-full md:hidden px-2">
              <AnimatePresence mode="popLayout">
                {items.map((item, idx) => (
                  <motion.div
                    key={"mobile-" + activeDay + "-" + item.event + "-" + idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="relative w-full rounded-xl bg-slate-950/70 border border-cyan-500/15 p-4 flex flex-col gap-2.5 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md"
                  >
                    {/* Left cyan accent bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-cyan-400 to-blue-500" />
                    
                    {/* Top row: Time and Venue */}
                    <div className="flex items-center justify-between gap-4 pl-2">
                      <span className="font-orbitron text-xs font-extrabold text-cyan-400 tracking-wider">
                        {item.time}
                      </span>
                      <span 
                        className="font-mono-custom text-[10px] text-cyan-300/80 bg-cyan-950/45 px-2.5 py-1 rounded border border-cyan-500/10 uppercase tracking-wider max-w-[60%] truncate"
                        dangerouslySetInnerHTML={{ __html: item.venue }}
                      />
                    </div>
                    
                    {/* Event Title + Subtitle */}
                    <h3 className="font-orbitron text-sm sm:text-base font-black tracking-wider text-slate-100 pl-2 uppercase">
                      {item.event}
                    </h3>
                    {item.subtitle && (
                      <p className="font-seaweed text-xs text-cyan-300 pl-2 -mt-1">
                        {item.subtitle}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>


        </div>

        <FooterDeck />
      </div>
    </main>
  );
}
