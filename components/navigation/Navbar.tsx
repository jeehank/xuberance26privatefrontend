"use client";

import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DepthWaterBar from "./DepthWaterBar";
import LiquidButton from "./LiquidButton";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiquidWrapper from "./LiquidWrapper";

export default function Navbar() {
  const { preloaderState } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (preloaderState !== "completed") return null;

  const navItems = [
    { name: "HOME", href: "/#hero" },
    { name: "EVENTS", href: "/events" },
    { name: "MENTORS", href: "/mentors" },
    { name: "ABOUT", href: "/#about" },
    { name: "SCHEDULE", href: "/schedule" },
    { name: "TEAM", href: "/team" },
  ];

  const handleScrollTo = (e: React.MouseEvent, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.split("#")[1];
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled
            ? "bg-slate-950/70 border-b border-cyan-500/15 py-3 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/#hero"
              onClick={(e) => handleScrollTo(e, "/#hero")}
              className="relative w-14 h-14 drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] block hover:scale-105 transition-transform duration-300"
            >
              <Image src="/Xub.png" alt="X-Uberance Logo" fill className="object-contain" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2 bg-cyan-950/20 px-2 py-1.5 rounded-full border border-cyan-500/10 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="block"
              >
                <LiquidWrapper className="px-6 py-2 rounded-full border border-cyan-500/0 hover:border-cyan-400/50 font-orbitron text-xs md:text-sm font-semibold tracking-widest text-cyan-100 group-hover:text-slate-950 transition-colors duration-500">
                  {item.name}
                </LiquidWrapper>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <LiquidButton />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-cyan-400 hover:text-cyan-200 focus:outline-none hover:bg-cyan-950/20 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {pathname === "/" && (
          <div className="w-full mt-3">
            <DepthWaterBar />
          </div>
        )}

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full inset-x-0 z-30 md:hidden bg-slate-950/95 border-b border-cyan-500/25 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] px-6 py-8 flex flex-col space-y-6"
            >
              <nav className="flex flex-col space-y-4 items-center">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleScrollTo(e, item.href);
                      setMobileMenuOpen(false);
                    }}
                    className="font-orbitron text-base font-bold tracking-widest text-cyan-100 hover:text-cyan-400 py-2 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex justify-center pt-4 border-t border-cyan-500/10">
                <LiquidButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
