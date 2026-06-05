"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface LiquidWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  as?: "div" | "button" | "a";
  href?: string;
}

export default function LiquidWrapper({
  children,
  className = "",
  onClick,
  as = "div",
  href,
}: LiquidWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  const bubbleVariants = {
    hover: (i: number) => ({
      y: [-20, -120],
      x: [0, (i % 2 === 0 ? 1 : -1) * (15 + i * 3)],
      scale: [1, 1.6, 0],
      opacity: [0, 0.8, 0],
      transition: {
        duration: 1.2 + i * 0.15,
        repeat: Infinity,
        delay: i * 0.15,
        ease: "easeOut" as const,
      },
    }),
    initial: {
      y: 0,
      opacity: 0,
    },
  };

  const Component = as;

  return (
    <Component
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden transition-all duration-500 cursor-pointer group ${className}`}
    >
      <span className="relative z-10 block pointer-events-none transition-colors duration-500 w-full text-center">
        {children}
      </span>

      <div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 z-0 transition-transform duration-500 ease-out origin-bottom scale-y-0 group-hover:scale-y-100"
        style={{ borderRadius: "inherit" }}
      />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={bubbleVariants}
            animate={isHovered ? "hover" : "initial"}
            className="absolute bottom-0 left-1/2 w-2 h-2 bg-white rounded-full"
            style={{ marginLeft: `${(i - 2.5) * 15}px` }}
          />
        ))}
      </div>
    </Component>
  );
}
