import { motion } from "motion/react";
import { ConstructionWorker, TrafficEnforcer, Student, StreetVendor } from "./Characters";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div
      className="size-full relative overflow-hidden flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D2B3E 50%, #0A1628 100%)" }}
    >
      {/* Hex Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon
                points="30,2 58,17 58,47 30,62 2,47 2,17"
                fill="none"
                stroke="rgba(0,229,255,0.4)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
      </div>

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #FF6B00, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #FFD700, transparent 70%)", filter: "blur(60px)" }} />

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)" }} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Characters + Banner Composite */}
        <div className="relative flex flex-col items-center">

          {/* Characters standing row */}
          <div className="flex items-end justify-center gap-2 relative z-20" style={{ marginBottom: "-6px" }}>
            {[
              { Component: ConstructionWorker, delay: 0.1, label: "Construction\nWorker" },
              { Component: TrafficEnforcer, delay: 0.2, label: "Traffic\nEnforcer" },
              { Component: Student, delay: 0.3, label: "Student" },
              { Component: StreetVendor, delay: 0.4, label: "Street\nVendor" },
            ].map(({ Component, delay }, i) => (
              <motion.div
                key={i}
                style={{ width: 90, height: 140 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.6, ease: "easeOut" }}
              >
                <Component />
              </motion.div>
            ))}
          </div>

          {/* Glowing Banner */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-3 rounded-[2rem] opacity-60"
              style={{
                background: "linear-gradient(90deg, #FF6B00, #FFD700, #FF6B00)",
                filter: "blur(18px)",
              }}
            />
            {/* Banner body */}
            <div
              className="relative px-14 py-5 rounded-[2rem]"
              style={{ background: "linear-gradient(90deg, #C94A00, #FF8C00, #FFB800, #FF8C00, #C94A00)" }}
            >
              <motion.h1
                className="text-4xl font-black text-white tracking-widest text-center whitespace-nowrap"
                style={{ textShadow: "0 0 30px rgba(255,220,0,0.8), 0 4px 12px rgba(0,0,0,0.6)" }}
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,220,0,0.6), 0 4px 12px rgba(0,0,0,0.6)",
                    "0 0 40px rgba(255,220,0,1), 0 4px 12px rgba(0,0,0,0.6)",
                    "0 0 20px rgba(255,220,0,0.6), 0 4px 12px rgba(0,0,0,0.6)",
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                QC HEAT RISK MONITOR
              </motion.h1>
            </div>
          </motion.div>
        </div>

        {/* START Button */}
        <motion.button
          onClick={onStart}
          className="relative mt-8 overflow-hidden cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
          transition={{
            opacity: { delay: 0.8, duration: 0.4 },
            scale: { delay: 0.8, duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.96 }}
          style={{ borderRadius: "9999px" }}
        >
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute -inset-2 rounded-full"
            style={{ background: "linear-gradient(90deg, #FF6B00, #FFD700, #FF6B00)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Glow blur */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #FF6B00, #FFD700)", filter: "blur(20px)", opacity: 0.7 }}
          />
          {/* Button face */}
          <div
            className="relative px-20 py-5 rounded-full"
            style={{ background: "linear-gradient(135deg, #FF8C00, #FF6B00, #CC4400)" }}
          >
            {/* Shine sweep */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            />
            <span
              className="relative text-4xl font-black text-white tracking-[0.3em]"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 0 20px rgba(255,200,0,0.4)" }}
            >
              START
            </span>
          </div>
        </motion.button>

        {/* Tagline */}
        <motion.p
          className="mt-6 text-center text-sm tracking-wide leading-relaxed max-w-md"
          style={{ color: "rgba(0,229,255,0.75)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          Real-time Heat Stroke Risk Assessment &amp; DOLE Policy Simulator for Quezon City
        </motion.p>

        {/* Version badge */}
        <motion.div
          className="mt-4 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          DOLE Dept. Order No. 102-10 Compliant
        </motion.div>
      </div>

      {/* Rising heat particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 4,
              height: 4 + Math.random() * 4,
              left: `${10 + Math.random() * 80}%`,
              bottom: 0,
              background: "radial-gradient(circle, rgba(255,150,0,0.6), transparent)",
            }}
            animate={{ y: [0, -600], opacity: [0, 0.7, 0] }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
