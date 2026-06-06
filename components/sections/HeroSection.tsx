"use client";

import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

function CountdownTimer() {
  const targetDate = new Date("2026-07-10T00:00:00+05:30").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const difference = Math.max(targetDate - now, 0);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (num: number) => String(num).padStart(2, "0");

  const segments = [
    { value: pad(timeLeft.days), label: "DAYS" },
    { value: pad(timeLeft.hours), label: "HOURS" },
    { value: pad(timeLeft.minutes), label: "MINUTES" },
    { value: pad(timeLeft.seconds), label: "SECONDS" },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 xs:gap-3 sm:gap-6 md:gap-8 bg-slate-950/40 px-3 py-3 sm:px-6 sm:py-5 rounded-3xl border border-cyan-500/10 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
      {segments.map((seg, i) => (
        <div key={seg.label} className="flex items-center gap-1.5 xs:gap-3 sm:gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <div className="relative overflow-hidden h-10 xs:h-14 sm:h-20 md:h-28 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={seg.value}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="font-orbitron text-2xl xs:text-4xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_20px_rgba(0,242,254,0.45)] tabular-nums"
                >
                  {seg.value}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="font-mono-custom text-[7px] xs:text-[9px] sm:text-[10px] md:text-xs tracking-[0.25em] text-cyan-300/80 mt-1 md:mt-2">
              {seg.label}
            </span>
          </div>

          {i < segments.length - 1 && (
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="font-orbitron text-lg xs:text-2xl sm:text-4xl md:text-6xl font-black text-cyan-400/60 self-start mt-1 xs:mt-2 sm:mt-4 md:mt-6"
            >
              :
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const setTerminalOpen = useAppStore((state) => state.setTerminalOpen);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-8 bg-transparent pt-20 pb-16 overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl flex flex-col items-center justify-center"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mt-12 mb-0 text-center px-4"
        >
          <span className="font-orbitron font-black text-[10px] sm:text-2xl md:text-3xl tracking-normal sm:tracking-[0.15em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-cyan-100 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] inline-block max-w-full whitespace-nowrap">
            St. Xavier&apos;s Collegiate School
          </span>
          <span className="font-mono-custom text-[10px] sm:text-sm md:text-base text-white/80 tracking-[0.3em] uppercase mt-1">
            PRESENTS
          </span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[26rem] md:h-[26rem] mb-4 -mt-4"
        >
          <Image
            src="/Xub.png"
            alt="X-Uberance Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-orbitron text-xl sm:text-5xl md:text-6xl font-black tracking-widest text-slate-100 uppercase px-4 whitespace-nowrap"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-cyan-100 to-cyan-400 drop-shadow-[0_0_30px_rgba(0,242,254,0.25)]">
            X-UBERANCE&apos;26
          </span>
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="font-seaweed text-xl sm:text-4xl md:text-5xl text-cyan-200 mt-2 tracking-wider whitespace-nowrap"
        >
          epochs of eminence
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/registration"
            className="liquid-hover-btn px-8 py-3 rounded-full bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs md:text-sm tracking-widest hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,242,254,0.4)] flex items-center justify-center"
          >
            REGISTER NOW
          </Link>

          <Link
            href="/events"
            className="liquid-hover-btn px-8 py-3 rounded-full border border-cyan-500/20 bg-cyan-950/20 font-orbitron font-bold text-xs md:text-sm tracking-widest text-cyan-400 hover:bg-cyan-950/40 hover:border-cyan-400/50 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm cursor-pointer flex items-center justify-center"
          >
            VIEW EVENTS
          </Link>


        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 md:mt-12 w-full flex justify-center"
        >
          <CountdownTimer />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-400 to-transparent relative overflow-hidden">
          <motion.div
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 left-0 right-0 h-4 bg-cyan-400 shadow-[0_0_10px_#00f2fe]"
          />
        </div>
      </div>
    </section>
  );
}
