"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface BubbleBurstProps {
  active: boolean;
}

export default function BubbleBurst({ active }: BubbleBurstProps) {
  const bubbleCount = 45;

  const bubbles = useMemo(() => {
    return Array.from({ length: bubbleCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 250;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 6 + Math.random() * 18;
      const duration = 0.8 + Math.random() * 0.8;
      const delay = Math.random() * 0.15;

      return {
        id: i,
        x,
        y,
        size,
        duration,
        delay,
      };
    });
  }, []);

  if (!active) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden flex items-center justify-center">
      <div className="relative w-0 h-0">
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 0.9 }}
            animate={{
              x: b.x,
              y: b.y,
              scale: [0.2, 1.2, 0],
              opacity: [0.9, 0.6, 0],
            }}
            transition={{
              duration: b.duration,
              ease: "easeOut",
              delay: b.delay,
            }}
            className="absolute rounded-full border border-cyan-300/60 bg-gradient-to-tr from-cyan-400/20 to-white/40 backdrop-blur-[1px]"
            style={{
              width: b.size,
              height: b.size,
              left: -b.size / 2,
              top: -b.size / 2,
              boxShadow: "0 0 10px rgba(0, 242, 254, 0.4)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
