"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/navigation/Navbar";
import FooterDeck from "@/components/sections/FooterDeck";
import VideoBackground from "@/components/sections/VideoBackground";
import Preloader from "@/components/preloader/Preloader";

// Animation configurations
const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const slideInRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

// Data models
const teacherRows = [
  [
    { name: "Mr. Santanu Jana", title: "Teacher-in-Charge" }
  ],
  [
    { name: "Mr. Somnath Dhar", title: "Member" },
    { name: "Ms. Anasuya Mandal", title: "Member" },
    { name: "Ms. Sudha Jaiswal", title: "Member" }
  ],
  [
    { name: "Mr. Asit Das", title: "Member" },
    { name: "Mr. Farino Torcato", title: "Member" },
    { name: "Mr. Romario Angelo Topno", title: "Member" }
  ],
  [
    { name: "Ms. Dipanjana Roy", title: "Member" },
    { name: "Ms. Sayanti Koner", title: "Member" },
    { name: "Ms. Aparna Sikdar", title: "Member" }
  ]
];

const coreCommittee = {
  conveners: [{ name: "Adipta Mukherjee", title: "Convener" }],
  coConveners: [
    { name: "Rachiet Somani", title: "Co-Convener" },
    { name: "Abhirup Sen", title: "Co-Convener" },
  ],
  treasurers: [
    { name: "Lakshya Rampuria", title: "Treasurer" },
    { name: "Agastaya Poddar", title: "Treasurer" },
  ],
  techDirectors: [
    { name: "Yuvraj Singh", title: "Technical Director" },
    { name: "Jeehan Karanjai", title: "Technical Director" },
  ],
  directors: [
    { name: "Devansh Farmania", title: "Director" },
    { name: "Aarush Kajaria", title: "Director" },
    { name: "Madhav Sharma", title: "Director" },
  ],
  pros: [
    { name: "Jonathan Benjamin", title: "P.R.O." },
    { name: "Debayan Pathak", title: "P.R.O." },
  ],
};

const departmentHeads = [
  {
    dept: "Technical",
    members: ["1.", "2."],
  },
  {
    dept: "School In Charge",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Management",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Logistics",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Hospitality",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Security",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Photography",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Transport",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Editorial",
    members: ["1.", "2.", "3."],
  },
  {
    dept: "Tech Team",
    members: [
      "1.",
      "2.",
      "3.",
      "4.",
      "5.",
      "6.",
      "7.",
      "8.",
      "9.",
    ],
  },
];

function HologramCard({
  name,
  title,
  imageSrc,
  animDir,
  isCore = false,
  fillGrid = false,
}: {
  name: string;
  title?: string;
  imageSrc: string;
  animDir: typeof slideInLeft | typeof slideInRight;
  isCore?: boolean;
  fillGrid?: boolean;
}) {
  const cardWidth = fillGrid
    ? "w-full"
    : isCore
      ? "w-[280px] md:w-[340px]"
      : "w-[200px] md:w-[230px]";

  const imgContainerClass = fillGrid
    ? "relative w-full aspect-square rounded-xl overflow-hidden shadow-[0_0_35px_rgba(0,255,255,0.2)] group-hover:shadow-[0_0_60px_rgba(0,255,255,0.4)] transition-shadow duration-500"
    : isCore
      ? "relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.25)] group-hover:shadow-[0_0_70px_rgba(0,255,255,0.45)] transition-shadow duration-500"
      : "relative w-[200px] h-[200px] md:w-[230px] md:h-[230px] rounded-xl overflow-hidden shadow-[0_0_35px_rgba(0,255,255,0.2)] group-hover:shadow-[0_0_60px_rgba(0,255,255,0.4)] transition-shadow duration-500";

  return (
    <motion.div
      {...animDir}
      className={`group flex flex-col items-center text-center ${cardWidth}`}
    >
      {/* Image container with pulsing glow */}
      <div className="relative mb-4 w-full flex justify-center">
        {/* Pulsing cyan glow behind the image */}
        <div className="absolute -inset-4 rounded-2xl bg-cyan-400/25 blur-3xl animate-[glowPulse_3s_ease-in-out_infinite] pointer-events-none" />
        <div className={imgContainerClass}>
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover rounded-xl"
          />
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/50 via-transparent to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          {/* Border glow */}
          <div className="absolute inset-0 rounded-xl border border-cyan-400/20 group-hover:border-cyan-400/50 transition-colors duration-500" />
        </div>
      </div>
      <h3 className={
        fillGrid
          ? "font-sans text-xs sm:text-lg md:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors duration-300 animate-none"
          : isCore
            ? "font-sans text-2xl md:text-3xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors duration-300 animate-none"
            : "font-sans text-lg md:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors duration-300 animate-none"
      }>
        {name}
      </h3>
      {title && (
        <p className={
          fillGrid
            ? "font-mono-custom text-[10px] sm:text-sm md:text-base text-cyan-400/70 tracking-wider mt-1"
            : isCore
              ? "font-mono-custom text-base md:text-lg text-cyan-400/70 tracking-wider mt-1"
              : "font-mono-custom text-sm md:text-base text-cyan-400/70 tracking-wider mt-1"
        }>
          {title}
        </p>
      )}
    </motion.div>
  );
}

export default function TeamPage() {
  return (
    <main className="relative min-h-screen w-full select-none overflow-x-hidden text-slate-100 bg-transparent">
      <VideoBackground />
      <Preloader />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow pt-32 pb-24 px-6 w-full flex flex-col items-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="kusanagi font-orbitron text-center text-5xl md:text-7xl font-black mt-20 mb-10 uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            OUR TEAM
          </motion.h1>

          {/* ===================== TEACHERS IN CHARGE ===================== */}
          <section className="w-full mb-16 flex flex-col items-center gap-10">
            <motion.h2
              {...fadeUp}
              className="font-orbitron text-3xl md:text-5xl font-black tracking-widest text-center pt-10 mb-2 uppercase text-slate-100"
            >
              Teachers Core Committee
            </motion.h2>
            {teacherRows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-3 justify-items-center items-start gap-x-4 md:gap-x-16 gap-y-10 w-full max-w-[80vw]"
              >
                {row.map((teacher, idx) => (
                  <div
                    key={teacher.name}
                    className={row.length === 1 ? "col-start-2 w-full" : "w-full"}
                  >
                    <HologramCard
                      name={teacher.name}
                      title={teacher.title}
                      imageSrc="/placeholders/placeholder.jpg"
                      animDir={(rowIdx + idx) % 2 === 0 ? slideInLeft : slideInRight}
                      fillGrid={true}
                    />
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* ===================== CORE COMMITTEE ===================== */}
          <section className="w-full mb-16 flex flex-col items-center">
            <motion.h2
              {...fadeUp}
              className="font-orbitron text-3xl md:text-5xl font-black tracking-widest text-center pt-10 mb-16 uppercase text-slate-100"
            >
              Core Committee
            </motion.h2>

            {/* Conveners */}
            <div className="mb-16 w-full flex flex-col items-center">
              <motion.h3
                {...fadeUp}
                className="font-orbitron text-2xl md:text-4xl font-bold tracking-wider mb-10 text-slate-100 uppercase text-center"
              >
                Conveners
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 w-full">
                {coreCommittee.conveners.map((member, idx) => (
                  <HologramCard
                    key={member.name}
                    name={member.name}
                    title={member.title}
                    imageSrc="/placeholders/placeholder.jpg"
                    animDir={idx % 2 === 0 ? slideInLeft : slideInRight}
                    isCore={true}
                  />
                ))}
              </div>
            </div>

            {/* Co-Conveners */}
            <div className="mb-16 w-full flex flex-col items-center">
              <motion.h3
                {...fadeUp}
                className="font-orbitron text-2xl md:text-4xl font-bold tracking-wider mb-10 text-slate-100 uppercase text-center"
              >
                Co-Conveners
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 w-full">
                {coreCommittee.coConveners.map((member, idx) => (
                  <HologramCard
                    key={member.name}
                    name={member.name}
                    title={member.title}
                    imageSrc="/placeholders/placeholder.jpg"
                    animDir={idx % 2 === 0 ? slideInLeft : slideInRight}
                    isCore={true}
                  />
                ))}
              </div>
            </div>

            {/* Treasurers */}
            <div className="mb-16 w-full flex flex-col items-center">
              <motion.h3
                {...fadeUp}
                className="font-orbitron text-2xl md:text-4xl font-bold tracking-wider mb-10 text-slate-100 uppercase text-center"
              >
                Treasurers
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 w-full">
                {coreCommittee.treasurers.map((member, idx) => (
                  <HologramCard
                    key={member.name}
                    name={member.name}
                    title={member.title}
                    imageSrc="/placeholders/placeholder.jpg"
                    animDir={idx % 2 === 0 ? slideInLeft : slideInRight}
                    isCore={true}
                  />
                ))}
              </div>
            </div>

            {/* Technical Directors */}
            <div className="mb-16 w-full flex flex-col items-center">
              <motion.h3
                {...fadeUp}
                className="font-orbitron text-2xl md:text-4xl font-bold tracking-wider mb-10 text-slate-100 uppercase text-center"
              >
                Technical Directors
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 w-full">
                {coreCommittee.techDirectors.map((member, idx) => (
                  <HologramCard
                    key={member.name}
                    name={member.name}
                    title={member.title}
                    imageSrc="/placeholders/placeholder.jpg"
                    animDir={idx % 2 === 0 ? slideInLeft : slideInRight}
                    isCore={true}
                  />
                ))}
              </div>
            </div>

            {/* Directors */}
            <div className="mb-16 w-full flex flex-col items-center">
              <motion.h3
                {...fadeUp}
                className="font-orbitron text-2xl md:text-4xl font-bold tracking-wider mb-10 text-slate-100 uppercase text-center"
              >
                Directors
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 w-full">
                {coreCommittee.directors.map((member, idx) => (
                  <HologramCard
                    key={member.name}
                    name={member.name}
                    title={member.title}
                    imageSrc="/placeholders/placeholder.jpg"
                    animDir={idx % 2 === 0 ? slideInLeft : slideInRight}
                    isCore={true}
                  />
                ))}
              </div>
            </div>

            {/* P.R.O.s */}
            <div className="mb-16 w-full flex flex-col items-center">
              <motion.h3
                {...fadeUp}
                className="font-orbitron text-2xl md:text-4xl font-bold tracking-wider mb-10 text-slate-100 uppercase text-center"
              >
                P.R.O.S
              </motion.h3>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 w-full">
                {coreCommittee.pros.map((member, idx) => (
                  <HologramCard
                    key={member.name}
                    name={member.name}
                    title={member.title}
                    imageSrc="/placeholders/placeholder.jpg"
                    animDir={idx % 2 === 0 ? slideInLeft : slideInRight}
                    isCore={true}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ===================== HEADS OF DEPARTMENTS ===================== */}
          <section className="w-full flex flex-col items-center mb-24">
            <motion.h2
              {...fadeUp}
              className="font-orbitron text-3xl md:text-5xl font-black tracking-widest text-center pt-10 mb-16 uppercase text-slate-100"
            >
              Heads of Departments
            </motion.h2>

            {/* Stacked vertically – one department below another */}
            <div className="flex flex-col items-center gap-20 w-full">
              {departmentHeads.map((deptData, idx) => (
                <motion.div
                  key={deptData.dept}
                  {...(idx % 2 === 0 ? slideInLeft : slideInRight)}
                  className="flex flex-col items-center text-center w-full"
                >
                  <h3 className="font-orbitron text-2xl md:text-4xl font-bold tracking-widest text-cyan-400 mb-4 uppercase">
                    {deptData.dept}
                  </h3>
                  <div className="flex flex-col gap-2 w-full items-center">
                    {deptData.members.map((name) => (
                      <p
                        key={name}
                        className="font-sans text-lg md:text-xl font-bold text-slate-200 hover:text-cyan-300 transition-colors"
                      >
                        {name}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <FooterDeck />
      </div>
    </main>
  );
}
