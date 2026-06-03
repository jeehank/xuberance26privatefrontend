"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder logo used for all sponsors until real logos are added
const PLACEHOLDER_LOGO = "/sponsors/itc.jpeg";

interface Sponsor {
  name: string;
  logo: string;
}

interface SponsorTier {
  title: string;
  sponsors: Sponsor[];
  logoSize: number; // px height for the logo
}

const sponsorTiers: SponsorTier[] = [
  {
    title: "TITLE SPONSOR",
    sponsors: [{ name: "Title Sponsor", logo: PLACEHOLDER_LOGO }],
    logoSize: 160,
  },
  {
    title: "CO-SPONSOR",
    sponsors: [{ name: "Co Sponsor", logo: PLACEHOLDER_LOGO }],
    logoSize: 130,
  },
  {
    title: "ASSOCIATE SPONSOR",
    sponsors: [{ name: "Associate Sponsor", logo: PLACEHOLDER_LOGO }],
    logoSize: 130,
  },
  {
    title: "GATE SPONSOR",
    sponsors: [{ name: "Gate Sponsor", logo: PLACEHOLDER_LOGO }],
    logoSize: 110,
  },
  {
    title: "ILLUMINATION SPONSOR",
    sponsors: [{ name: "Illumination Sponsor", logo: PLACEHOLDER_LOGO }],
    logoSize: 110,
  },
  {
    title: "RADIO PARTNER",
    sponsors: [{ name: "Radio Partner", logo: PLACEHOLDER_LOGO }],
    logoSize: 110,
  },
  {
    title: "MEDIA PARTNER",
    sponsors: [{ name: "Media Partner", logo: PLACEHOLDER_LOGO }],
    logoSize: 90,
  },
  {
    title: "CLOTHING PARTNER",
    sponsors: [{ name: "Clothing Partner", logo: PLACEHOLDER_LOGO }],
    logoSize: 90,
  },
  {
    title: "HYDRATION PARTNER",
    sponsors: [{ name: "Hydration Partner", logo: PLACEHOLDER_LOGO }],
    logoSize: 90,
  },
  {
    title: "KNOWLEDGE PARTNER",
    sponsors: [{ name: "Knowledge Partner", logo: PLACEHOLDER_LOGO }],
    logoSize: 90,
  },
];

const flagshipEventSponsors: Sponsor[] = Array.from({ length: 5 }, (_, i) => ({
  name: `Flagship Event Sponsor ${i + 1}`,
  logo: PLACEHOLDER_LOGO,
}));

const eventSponsors: Sponsor[] = Array.from({ length: 5 }, (_, i) => ({
  name: `Event Sponsor ${i + 1}`,
  logo: PLACEHOLDER_LOGO,
}));

// Group the individual tiers into visual rows for the pyramid layout
interface TierRow {
  tiers: SponsorTier[];
}

const pyramidRows: TierRow[] = [
  // Row 1: Title Sponsor (1)
  { tiers: [sponsorTiers[0]] },
  // Row 2: Co-Sponsor + Associate Sponsor (2)
  { tiers: [sponsorTiers[1], sponsorTiers[2]] },
  // Row 3: Gate + Illumination + Radio (3)
  { tiers: [sponsorTiers[3], sponsorTiers[4], sponsorTiers[5]] },
  // Row 4: Media + Clothing + Hydration + Knowledge (4)
  { tiers: [sponsorTiers[6], sponsorTiers[7], sponsorTiers[8], sponsorTiers[9]] },
];

function SponsorCard({
  sponsor,
  tier,
  label,
  index,
}: {
  sponsor: Sponsor;
  tier: SponsorTier;
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="flex flex-col items-center gap-2 md:gap-4 group min-w-0 flex-1"
      style={{ maxWidth: tier.logoSize + 50 }}
    >
      {/* Logo Container */}
      <div
        className="relative rounded-xl md:rounded-2xl overflow-hidden border border-cyan-500/15 bg-slate-950/40 backdrop-blur-md
                    group-hover:border-cyan-400/40 group-hover:shadow-[0_0_25px_rgba(0,242,254,0.12)]
                    transition-all duration-500 flex items-center justify-center p-2 md:p-5 w-full"
        style={{
          maxWidth: tier.logoSize + 50,
          aspectRatio: `${tier.logoSize + 50} / ${tier.logoSize + 30}`,
        }}
      >
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          width={tier.logoSize}
          height={tier.logoSize}
          className="object-contain group-hover:scale-105 transition-transform duration-500 w-full h-full"
        />
        {/* Subtle shimmer on top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
      </div>
      {/* Tier label directly under its logo */}
      {label && (
        <span className="font-orbitron text-[8px] sm:text-sm md:text-base font-semibold text-cyan-400 tracking-[0.1em] md:tracking-[0.15em] uppercase text-center leading-tight">
          {label}
        </span>
      )}
    </motion.div>
  );
}

export default function SponsorShowcase() {
  return (
    <section id="sponsors" className="relative py-20 md:py-28 bg-transparent overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] caustic-glow pointer-events-none -z-10 opacity-40" />

      <div className="w-full">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-orbitron text-3xl md:text-5xl font-black tracking-wider text-slate-100"
          >
            OUR SPONSORS
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-6" />
        </div>

        {/* Glass Card Container — full width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden"
        >
          {/* Solid dark background with gradient — avoids backdrop-blur clipping on tall elements */}
          <div className="absolute inset-0 bg-[#060d1c]/90" />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-slate-950/60 to-blue-950/40" />
          <div className="absolute inset-0 border-y border-cyan-400/15" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

          <div className="relative z-10 py-16 px-8 md:py-20 md:px-16 lg:py-24 lg:px-24">
            {/* === PYRAMID LAYOUT === */}
            <div className="flex flex-col items-center gap-16 md:gap-20">
              {pyramidRows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-nowrap justify-center gap-3 sm:gap-6 md:gap-16 lg:gap-24 w-full px-2 md:px-0">
                  {row.tiers.map((tier, tIdx) =>
                    tier.sponsors.map((sponsor, sIdx) => (
                      <SponsorCard
                        key={`${tier.title}-${sIdx}`}
                        sponsor={sponsor}
                        tier={tier}
                        label={tier.title}
                        index={rowIdx * 2 + tIdx + sIdx}
                      />
                    ))
                  )}
                </div>
              ))}

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

              {/* === FLAGSHIP EVENT SPONSORS === */}
              <div className="flex flex-col items-center gap-5 w-full">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-orbitron text-base md:text-lg font-bold text-cyan-400 tracking-[0.15em] uppercase"
                >
                  FLAGSHIP EVENT SPONSORS
                </motion.span>
                <div className="flex flex-wrap justify-center gap-8 md:gap-14 lg:gap-20">
                  {flagshipEventSponsors.map((sponsor, i) => (
                    <SponsorCard
                      key={`flagship-${i}`}
                      sponsor={sponsor}
                      tier={{ title: "FLAGSHIP EVENT SPONSORS", sponsors: [], logoSize: 90 }}
                      label=""
                      index={i}
                    />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />

              {/* === EVENT SPONSORS === */}
              <div className="flex flex-col items-center gap-5 w-full">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="font-orbitron text-base md:text-lg font-bold text-cyan-400 tracking-[0.15em] uppercase"
                >
                  EVENT SPONSORS
                </motion.span>
                <div className="flex flex-wrap justify-center gap-8 md:gap-14 lg:gap-20">
                  {eventSponsors.map((sponsor, i) => (
                    <SponsorCard
                      key={`event-${i}`}
                      sponsor={sponsor}
                      tier={{ title: "EVENT SPONSORS", sponsors: [], logoSize: 80 }}
                      label=""
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
