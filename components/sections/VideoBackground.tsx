"use client";

import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VideoBackground() {
  const scrollDepth = useAppStore((state) => state.scrollDepth);
  const setScrollDepth = useAppStore((state) => state.setScrollDepth);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setScrollDepth(0);
    }
  }, [pathname, setScrollDepth]);

  const baseOverlay = pathname === "/" ? (scrollDepth / 10994) * 0.9 : 0.4;
  const overlayOpacity = Math.min(Math.max(baseOverlay, 0), 0.9);

  return (
    <div className="fixed inset-0 w-full h-full -z-20 pointer-events-none overflow-hidden select-none">
      <Image
        src="/newbg.png"
        alt="Ocean Abyss Background"
        fill
        priority
        className="object-cover opacity-60"
      />

      <div
        className="absolute inset-0 bg-slate-950 transition-opacity duration-300 ease-out pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
