"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix: string;
  duration?: number;
}

function AnimatedCounter({ target, suffix, duration = 2000 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const [count, setCount] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    setIsGlitching(true);
    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      setCount(current);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setIsGlitching(false);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isInView, target, duration]);

  return (
    <span
      ref={ref}
      className="font-orbitron text-xl sm:text-4xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_25px_rgba(0,242,254,0.3)] tabular-nums transition-all"
    >
      {count}{suffix}
    </span>
  );
}

const stats = [
  { value: 3, label: "DAYS", suffix: "+" },
  { value: 40, label: "EVENTS", suffix: "+" },
  { value: 2000, label: "PARTICIPANTS", suffix: "+" },
];

export default function StatsBar() {
  return (
    <section className="relative py-12 md:py-16 bg-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/90 via-slate-950/95 to-blue-950/90" />
          <div className="absolute inset-0 border border-cyan-400/15 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5" />

          <div className="relative z-10 grid grid-cols-3 gap-0 divide-x divide-cyan-500/10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-14 px-3 sm:px-8 md:px-12 group"
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <span className="font-mono-custom text-[8px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.3em] text-cyan-300/70 mt-2 sm:mt-3 text-center">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
