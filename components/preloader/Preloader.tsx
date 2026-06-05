"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { preloaderState, setPreloaderState, setScrollLocked } = useAppStore();

  useEffect(() => {
    setScrollLocked(true);
    document.body.classList.add("scroll-locked");

    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 4) + 1;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
        }, 500);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [setScrollLocked]);

  useEffect(() => {
    if (isFadingOut) {
      const timeout = setTimeout(() => {
        setPreloaderState("completed");
        setScrollLocked(false);
        document.body.classList.remove("scroll-locked");
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [isFadingOut, setPreloaderState, setScrollLocked]);

  if (preloaderState === "completed") return null;

  return (
    <div
      className={`fixed inset-0 bg-[#02050e] z-50 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isFadingOut ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100 scale-100"
        }`}
    >
      <div className="relative flex flex-col items-center max-w-xs text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-32 h-32 md:w-36 md:h-36 mb-12 drop-shadow-[0_0_35px_rgba(0,242,254,0.35)]"
        >
          <Image
            src="/Xub.png"
            alt="X-Uberance Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <div className="relative w-64 md:w-80 h-[3px] bg-slate-900 border border-cyan-500/5 rounded-full overflow-visible">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-75 ease-out relative shadow-[0_0_10px_#00f2fe]"
            style={{ width: `${progress}%` }}
          >
            {progress < 100 && (
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#00f2fe,0_0_6px_#00f2fe]"
              />
            )}
          </div>
        </div>

        <div className="font-mono-custom text-[10px] text-cyan-400/55 tracking-[0.35em] mt-5 uppercase font-bold select-none tabular-nums">
          SYSTEM LOADING {progress}%
        </div>
      </div>
    </div>
  );
}
