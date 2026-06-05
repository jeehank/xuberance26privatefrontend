"use client";

import Link from "next/link";
import LiquidWrapper from "./LiquidWrapper";
import { useEffect, useState } from "react";

export default function LiquidButton() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.success && data.session) {
          setRole(data.session.role);
        } else {
          setRole(null);
        }
      } catch (e) {
        setRole(null);
      }
    };
    checkSession();

    // Listen for custom login/logout events to update the header dynamically
    window.addEventListener("session-change", checkSession);
    return () => window.removeEventListener("session-change", checkSession);
  }, []);

  let href = "/registration";
  let label = "REGISTER NOW";

  if (role === "admin") {
    href = "/registration/admin";
    label = "ADMIN";
  } else if (role === "member") {
    href = "/registration/member";
    label = "MEMBER";
  }

  return (
    <Link href={href} className="block">
      <LiquidWrapper
        className="px-8 py-3 rounded-full border-2 border-cyan-400 font-orbitron text-xs md:text-sm font-bold tracking-widest text-cyan-400 group-hover:text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.25)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] cursor-pointer"
      >
        {label}
      </LiquidWrapper>
    </Link>
  );
}

