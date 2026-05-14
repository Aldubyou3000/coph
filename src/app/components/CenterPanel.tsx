// ─────────────────────────────────────────────────────────────────────────────
// CenterPanel.tsx
// Centre column: risk banner, 3-D city background, animated character,
// atmospheric effects, and DOLE protocol advisory box.
//
// The CityScene (Three.js / WebGL) is preserved exactly as-is.
// All visual effects scale with the DOLE/PAGASA risk thresholds.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, AnimatePresence } from "motion/react";
import {
  ConstructionWorker,
  TrafficEnforcer,
  Student,
  StreetVendor,
  Civilian,        // ← NEW
} from "./Characters";
import { RiskInfo, getDoleText, SUBJECTS } from "./heatUtils";
import { CityScene } from "./CityScene";

// Map subject index → character component (must match SUBJECTS array order)
const CharacterComponents = [
  ConstructionWorker,
  StreetVendor,
  TrafficEnforcer,
  Student,
  Civilian,        // ← index 4
];

interface CenterPanelProps {
  risk:            RiskInfo;
  selectedSubject: number;
  temperature:     number;
  humidity:        number;
  heatIndex:       number;
}

export function CenterPanel({
  risk,
  selectedSubject,
  temperature,
  humidity,
  heatIndex,
}: CenterPanelProps) {
  const Char     = CharacterComponents[selectedSubject];
  const subject  = SUBJECTS[selectedSubject];
  const doleText = getDoleText(risk.level, subject.label);

  // ── Risk level boolean flags (used throughout for effect gating) ───────────
  // All visual effects are keyed to these exact DOLE/PAGASA thresholds
  const isSafe        = risk.level === "SAFE";           // HI < 27°C
  const isCaution     = risk.level === "CAUTION";        // HI 27–31°C
  const isExtCaution  = risk.level === "EXTREME CAUTION"; // HI 32–41°C
  const isDanger      = risk.level === "DANGER";          // HI 42–54°C
  const isExtreme     = risk.level === "EXTREME DANGER";  // HI ≥ 55°C
  const isDangerPlus  = isDanger || isExtreme;            // HI ≥ 42°C
  const isCautionPlus = isCaution || isExtCaution || isDangerPlus; // HI ≥ 27°C

  // ── Stress Intensity Scaling (Hybrid Model) ──────────────────────────────
  const { burden, tolerance } = subject;
  const effectiveHI   = heatIndex + (burden - tolerance);
  const stressFactor  = Math.max(0, (effectiveHI - 27) / 25); // 0.0 at 27C, 1.0 at 52C

  // Progressive effect counts — scaled by individual stressFactor
  const sweatDrops         = stressFactor >= 0.2 ? Math.min(Math.floor(stressFactor * 12), 8) : 0;
  const hazeCount          = Math.floor(stressFactor * 12);
  const particleCount      = Math.floor(stressFactor * 25);
  const emberCount         = isDangerPlus ? Math.floor(stressFactor * 20) : 0;
  const viewportSweatCount = isDangerPlus ? Math.floor(stressFactor * 12) : 0;
  const shakeIntensity     = stressFactor * 4; // Max shake displacement
  const heartRateScale     = 1 + (stressFactor * 0.5); // Animation speed multiplier

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden" style={{ minWidth: 0 }}>


      {/* ── Risk Level Banner ───────────────────────────────────────────────── */}
      <motion.div
        className="relative overflow-hidden rounded-2xl flex items-center justify-center py-4 flex-shrink-0"
        animate={{
          boxShadow: isExtreme
            ? [
                `0 0 12px ${risk.glow}88, inset 0 0 24px ${risk.glow}55`,
                `0 0 22px ${risk.glow}CC, inset 0 0 40px ${risk.glow}88`,
                `0 0 12px ${risk.glow}88, inset 0 0 24px ${risk.glow}55`,
              ]
            : [
                `0 0 8px  ${risk.glow}55, inset 0 0 12px ${risk.glow}33`,
                `0 0 14px ${risk.glow}88, inset 0 0 22px ${risk.glow}55`,
                `0 0 8px  ${risk.glow}55, inset 0 0 12px ${risk.glow}33`,
              ],
        }}
        transition={{ duration: isExtreme ? 0.8 : 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `linear-gradient(135deg, ${risk.bg}, rgba(0,0,0,0.4))`,
          border:     `1px solid ${risk.color}55`,
        }}
      >
        {/* Extreme danger pulse overlay */}
        {isExtreme && (
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            style={{ background: `radial-gradient(circle, ${risk.color}22, transparent 70%)` }}
          />
        )}

        <motion.div
          key={risk.level}
          className="relative font-black tracking-widest text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            isExtreme
              ? { scale: [1, 1.04, 1], opacity: 1 }
              : { scale: 1, opacity: 1 }
          }
          transition={
            isExtreme
              ? { scale: { duration: 0.8, repeat: Infinity }, opacity: { duration: 0.3 } }
              : { duration: 0.3 }
          }
          style={{
            fontSize:   "clamp(1.4rem, 3.5vw, 2rem)",
            color:      risk.color,
            textShadow: `0 0 30px ${risk.glow}, 0 0 60px ${risk.glow}`,
          }}
        >
          {risk.level}
        </motion.div>
      </motion.div>

      {/* ── Character Display Area ──────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden flex items-end justify-center"
        style={{
          background: "#0A1628",
          border:     `1px solid ${risk.color}22`,
          height:     "min(490px, 55vh)",
          flexShrink: 0,
        }}
      >
        {/* SVG filter definition for heat distortion effect */}
        <svg className="absolute" width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="heat-distortion">
              <feTurbulence
                type="turbulence"
                baseFrequency={`0.01 ${isExtreme ? 0.05 : isDanger ? 0.04 : isExtCaution ? 0.025 : 0.02}`}
                numOctaves="3"
                seed="2"
              >
                <animate
                  attributeName="baseFrequency"
                  values={`0.01 ${isExtreme ? 0.04 : 0.02};0.01 ${isExtreme ? 0.06 : isDanger ? 0.045 : 0.03};0.01 ${isExtreme ? 0.04 : 0.02}`}
                  dur={isExtreme ? "2s" : "4s"}
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                scale={isExtreme ? 30 : isDanger ? 18 : isExtCaution ? 8 : 0}
              />
            </filter>
          </defs>
        </svg>

        {/* Heat Distortion Wrapper — applies the filter to everything inside */}
        <div 
          className="absolute inset-0 flex items-end justify-center"
          style={{ filter: (isExtCaution || isDangerPlus) ? "url(#heat-distortion)" : "none" }}
        >
          {/* 3D City Background */}
          <CityScene temperature={heatIndex} selectedSubject={selectedSubject} />
        </div>

        {/* ── Dry Air / Dust Shimmer ── (RH < 40%) */}
        {humidity < 40 && Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`dust-${i}`}
            className="absolute pointer-events-none z-[5]"
            style={{
              width: 2, height: 2,
              background: "rgba(255, 255, 200, 0.6)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 4px rgba(255, 200, 0, 0.4)",
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}


        {/* ── Humidity / Moisture Overlay ── */}
        {/* Low humidity = clear/dry. High humidity = misty vapor, condensation. */}
        {humidity > 50 && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: `radial-gradient(ellipse at center bottom,
                rgba(200, 220, 255, ${Math.min((humidity - 50) * 0.006, 0.3)}) 0%,
                rgba(180, 210, 245, ${Math.min((humidity - 50) * 0.004, 0.2)}) 40%,
                transparent 80%
              )`,
              backdropFilter: humidity > 70
                ? `blur(${Math.min((humidity - 70) * 0.05, 1.5)}px)`
                : "none",
            }}
          />
        )}

        {/* Animated vapor wisps — high humidity (> 60%) */}
        {humidity > 60 &&
          Array.from({ length: Math.min(Math.floor((humidity - 60) / 8), 5) }).map((_, i) => (
            <motion.div
              key={`vapor-${i}`}
              className="absolute pointer-events-none z-[1]"
              style={{
                width:        "60%",
                height:       30 + i * 10,
                bottom:       `${5 + i * 12}%`,
                left:         `${10 + i * 8}%`,
                background: `linear-gradient(90deg,
                  transparent,
                  rgba(200, 220, 255, ${0.06 + (humidity - 60) * 0.002}),
                  rgba(220, 235, 255, ${0.08 + (humidity - 60) * 0.003}),
                  rgba(200, 220, 255, ${0.06 + (humidity - 60) * 0.002}),
                  transparent
                )`,
                borderRadius: "50%",
                filter:       `blur(${8 + i * 3}px)`,
              }}
              animate={{ x: ["-10%", "10%", "-10%"], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
            />
          ))}

        {/* Risk colour tint overlay — z-[1] */}
        <motion.div
          key={`tint-${risk.level}`}
          className="absolute inset-0 pointer-events-none z-[1]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isSafe
              ? [0.03, 0.08, 0.03]
              : isExtreme
              ? [0.2, 0.45, 0.2]
              : isDanger
              ? [0.15, 0.3, 0.15]
              : [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: isExtreme ? 0.8 : isDanger ? 1.5 : 3,
            repeat: Infinity,
          }}
          style={{ background: `radial-gradient(ellipse at center, ${risk.color}30, transparent 70%)` }}
        />

        {/* Heat haze lines — EXTREME CAUTION+ (HI ≥ 32°C) */}
        {hazeCount > 0 &&
          Array.from({ length: hazeCount }).map((_, i) => (
            <motion.div
              key={`haze-${i}`}
              className="absolute inset-x-0 pointer-events-none z-[2]"
              style={{
                height:     isExtreme ? 4 : 3,
                background: `linear-gradient(90deg, transparent, ${risk.color}${isExtreme ? "60" : "40"}, transparent)`,
                top:        `${8 + i * (90 / hazeCount)}%`,
              }}
              animate={{ x: ["-100%", "100%"], opacity: [0, isExtreme ? 1 : 0.8, 0] }}
              transition={{
                duration: isExtreme ? 0.8 + i * 0.1 : 1.2 + i * 0.15,
                repeat:   Infinity,
                delay:    i * 0.2,
                ease:     "linear",
              }}
            />
          ))}

        {/* Rising heat particles — CAUTION+ (HI ≥ 27°C) */}
        {particleCount > 0 &&
          Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={`heat-p-${i}`}
              className="absolute rounded-full pointer-events-none z-[2]"
              style={{
                width:      isExtreme ? 5 + (i % 3) * 3 : 3 + (i % 3) * 2,
                height:     isExtreme ? 5 + (i % 3) * 3 : 3 + (i % 3) * 2,
                left:       `${5 + (i * (90 / particleCount)) % 90}%`,
                bottom:     "5%",
                background: `radial-gradient(circle, ${risk.color}CC, transparent)`,
              }}
              animate={{ y: [0, isExtreme ? -450 : -350], opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.3] }}
              transition={{
                duration: isExtreme ? 1.5 + (i % 4) * 0.3 : 2.5 + (i % 4) * 0.5,
                repeat:   Infinity,
                delay:    i * 0.2,
                ease:     "easeOut",
              }}
            />
          ))}

        {/* Viewport sweat drops — EXTREME CAUTION+ (HI ≥ 32°C) */}
        {viewportSweatCount > 0 &&
          Array.from({ length: viewportSweatCount }).map((_, i) => (
            <motion.div
              key={`sweat-${i}`}
              className="absolute pointer-events-none z-[3]"
              style={{
                width:        10 + (i % 3) * 5,
                height:       18 + (i % 4) * 8,
                borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background:   "linear-gradient(180deg, rgba(180,230,255,0.7), rgba(120,200,255,0.5))",
                boxShadow:    "0 3px 6px rgba(0,150,255,0.3), inset 0 -2px 4px rgba(255,255,255,0.4)",
                ...(i % 3 === 0
                  ? { left: `${3 + i * 2}%`,   top: `${10 + i * 8}%` }
                  : i % 3 === 1
                  ? { right: `${3 + i * 2}%`,  top: `${15 + i * 7}%` }
                  : { left: `${20 + i * 10}%`, top: "3%" }),
              }}
              animate={{
                y:      [0, 60 + i * 20, 120 + i * 30],
                opacity:[0.9, 0.7, 0],
                scaleY: [1, 1.8, 2.5],
                scaleX: [1, 0.7, 0.4],
              }}
              transition={{
                duration: isExtreme ? 2.5 + i : 4 + i * 1.5,
                repeat:   Infinity,
                delay:    i * (isExtreme ? 0.6 : 1.2),
                ease:     "easeIn",
              }}
            />
          ))}

        {/* Floating heat embers — DANGER+ only (HI ≥ 42°C) */}
        {emberCount > 0 &&
          Array.from({ length: emberCount }).map((_, i) => (
            <motion.div
              key={`ember-${i}`}
              className="absolute pointer-events-none z-[3]"
              style={{
                width:      isExtreme ? 3 + (i % 3) * 2 : 2 + (i % 3),
                height:     isExtreme ? 3 + (i % 3) * 2 : 2 + (i % 3),
                borderRadius:"50%",
                left:       `${8 + (i * 11) % 84}%`,
                bottom:     `${(i * 13) % 40}%`,
                background: isExtreme
                  ? "radial-gradient(circle, #FF0033, #FF4400, transparent)"
                  : "radial-gradient(circle, #FF6600, #FF8800, transparent)",
                boxShadow:  isExtreme
                  ? "0 0 8px rgba(255,0,51,0.9), 0 0 16px rgba(255,0,51,0.5)"
                  : "0 0 4px rgba(255,100,0,0.6)",
              }}
              animate={{
                y:       [0, -120 - i * 30],
                x:       [0, i % 2 === 0 ? 20 : -20, i % 2 === 0 ? -10 : 10],
                opacity: [0, 1, 0.8, 0],
                scale:   [0.3, isExtreme ? 1.5 : 1, 0.5],
              }}
              transition={{
                duration: isExtreme ? 2 + (i % 3) : 3 + (i % 3) * 1.5,
                repeat:   Infinity,
                delay:    i * 0.4,
                ease:     "easeOut",
              }}
            />
          ))}

        {/* Edge heat vignette — DANGER+ only (HI ≥ 42°C) */}
        {isDangerPlus && (
          <div
            className="absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: `radial-gradient(ellipse at center,
                transparent ${isExtreme ? "40%" : "50%"},
                rgba(${isExtreme ? "255,0,51" : "255,100,0"}, ${isExtreme ? 0.35 : 0.2}) 85%,
                rgba(${isExtreme ? "200,0,20" : "200,50,0"}, ${isExtreme ? 0.45 : 0.3}) 100%
              )`,
            }}
          />
        )}

        {/* Humidity condensation drops — driven by relative humidity — z-[4] */}
        {humidity > 55 &&
          Array.from({ length: Math.min(Math.floor((humidity - 55) / 5), 10) }).map((_, i) => (
            <motion.div
              key={`humid-drop-${i}`}
              className="absolute pointer-events-none z-[4]"
              style={{
                width:        8 + (i % 4) * 4,
                height:       14 + (i % 3) * 8,
                borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
                background:   "linear-gradient(180deg, rgba(200,235,255,0.75), rgba(150,210,255,0.55))",
                boxShadow:    "0 2px 6px rgba(100,180,255,0.35), inset 0 -2px 4px rgba(255,255,255,0.5)",
                ...(i % 4 === 0
                  ? { left: `${2 + i * 3}%`,          top: `${5 + (i * 11) % 30}%` }
                  : i % 4 === 1
                  ? { right: `${2 + i * 2}%`,          top: `${8 + (i * 9) % 35}%` }
                  : i % 4 === 2
                  ? { left: `${15 + (i * 13) % 60}%`, top: "2%" }
                  : { left: `${10 + (i * 17) % 70}%`, top: `${5 + (i * 7) % 20}%` }),
              }}
              animate={{
                y:      [0, 40 + i * 15, 100 + i * 25, 180 + i * 20],
                opacity:[0, 0.9, 0.7, 0],
                scaleY: [0.8, 1, 1.5, 2.5],
                scaleX: [1, 0.9, 0.7, 0.3],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat:   Infinity,
                delay:    i * 1.8,
                ease:     "easeIn",
              }}
            />
          ))}

        {/* Humidity film — subtle wet sheen at very high humidity (> 75%) */}
        {humidity > 75 && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-[4]"
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: `linear-gradient(180deg,
                rgba(180,210,255,${Math.min((humidity - 75) * 0.008, 0.15)}) 0%,
                transparent 30%,
                transparent 70%,
                rgba(180,210,255,${Math.min((humidity - 75) * 0.006, 0.1)}) 100%
              )`,
            }}
          />
        )}

        {/* ── Character — z-[10] ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSubject}
            className="relative z-[10]"
            style={{ width: "min(300px, 38%)", height: "min(460px, 90%)" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale:   1,
              y:  isExtreme
                ? [-shakeIntensity, shakeIntensity, -shakeIntensity]
                : [0, -6, 0],
              x:  isExtreme
                ? [-shakeIntensity, shakeIntensity, -shakeIntensity / 2, shakeIntensity, -shakeIntensity]
                : 0,
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{
              opacity: { duration: 0.3 },
              scale:   { duration: 0.3 },
              y: {
                duration: isExtreme
                  ? 0.3 / heartRateScale
                  : 2.5 / heartRateScale,
                repeat: Infinity,
                ease: "easeInOut",
              },
              x: isExtreme
                ? { duration: 0.15 / heartRateScale, repeat: Infinity }
                : { duration: 0 },
            }}
          >
            {/* Heat aura — CAUTION+ (HI ≥ 27°C), intensity per threshold */}
            {isCautionPlus && (
              <motion.div
                key={`aura-${risk.level}`}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 40%,
                    ${isExtreme
                      ? "rgba(255,0,30,0.4)"
                      : isDanger
                      ? "rgba(255,68,0,0.3)"
                      : isExtCaution
                      ? "rgba(255,140,0,0.2)"
                      : "rgba(255,215,0,0.1)"
                    } 0%,
                    ${isExtreme
                      ? "rgba(255,30,0,0.25)"
                      : isDanger
                      ? "rgba(255,100,0,0.15)"
                      : isExtCaution
                      ? "rgba(255,180,30,0.08)"
                      : "rgba(255,215,0,0.04)"
                    } 35%,
                    transparent 70%
                  )`,
                  filter:    `blur(${isDangerPlus ? 10 : 5}px)`,
                  transform: "scale(1.3, 1.2)",
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isExtreme
                    ? [0.7, 1, 0.7]
                    : isDanger
                    ? [0.5, 0.8, 0.5]
                    : isExtCaution
                    ? [0.3, 0.5, 0.3]
                    : [0.2, 0.35, 0.2],
                  scale: isExtreme
                    ? [1.25, 1.45, 1.25]
                    : isDanger
                    ? [1.2, 1.35, 1.2]
                    : [1.15, 1.25, 1.15],
                }}
                transition={{
                  duration: isExtreme ? 0.6 : isDanger ? 1 : 2,
                  repeat:   Infinity,
                  ease:     "easeInOut",
                }}
              />
            )}

            {/* Heat shimmer ring — DANGER+ (HI ≥ 42°C) */}
            {isDangerPlus && (
              <motion.div
                key={`ring-${risk.level}`}
                className="absolute inset-0 pointer-events-none"
                style={{
                  border:       `${isExtreme ? 3 : 2}px solid ${isExtreme ? "rgba(255,0,30,0.4)" : "rgba(255,100,0,0.25)"}`,
                  borderRadius: "50%",
                  transform:    "scale(1.1)",
                  filter:       "blur(3px)",
                }}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: [1.1, isExtreme ? 1.6 : 1.4, 1.1], opacity: [0.5, 0, 0.5] }}
                transition={{
                  duration: isExtreme ? 1.2 : 2,
                  repeat:   Infinity,
                  ease:     "easeInOut",
                }}
              />
            )}

            {/* Character SVG */}
            <Char sad={isDangerPlus} />

            {/* Sweat drops on character body — randomized positions, EXTREME CAUTION+ */}
            {sweatDrops > 0 && Array.from({ length: sweatDrops }).map((_, i) => {
              // Deterministic pseudo-random using prime offsets — stable across renders
              const left = 12 + ((i * 41 + 7)  % 57);          // 12–69% — across torso
              const top  =  6 + ((i * 29 + 13) % 44);          // 6–50% — varied height
              const w    =  4 + (i * 3)  % 4;                  // 4–7px width
              const h    =  7 + (i * 5)  % 7;                  // 7–13px height
              const dur  =  0.65 + (i * 0.23) % 0.85;          // 0.65–1.5s duration
              const del  =  (i * 0.19)   % 1.2;                // 0–1.2s stagger
              const drop = 55 + (i * 17) % 40;                 // 55–95px fall distance
              return (
                <motion.div
                  key={`sweat-body-${risk.level}-${i}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width:      w,
                    height:     h,
                    left:       `${left}%`,
                    top:        `${top}%`,
                    background: "linear-gradient(to bottom, #7FEFFF, #00B4CC)",
                    boxShadow:  "0 0 4px rgba(0,229,255,0.7)",
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, drop], opacity: [0.95, 0], scaleY: [1, 0.55] }}
                  transition={{ duration: dur, repeat: Infinity, delay: del, ease: "easeIn" }}
                />
              );
            })}

            {/* Water pour — construction worker at DANGER+ (HI ≥ 42°C) */}
            {selectedSubject === 0 && isDangerPlus && (
              <div className="absolute" style={{ top: "8%", right: "10%" }}>
                {Array.from({ length: isExtreme ? 8 : 4 }).map((_, i) => (
                  <motion.div
                    key={`pour-${risk.level}-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width:      isExtreme ? 4 : 3,
                      height:     isExtreme ? 12 : 8,
                      left:       i * 4,
                      background: "rgba(0,180,255,0.7)",
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [0, isExtreme ? 50 : 35], opacity: [0.8, 0] }}
                    transition={{ duration: isExtreme ? 0.5 : 0.7, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}


          </motion.div>
        </AnimatePresence>

        {/* Subject name badge — z-[20] */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-bold z-[20]"
          style={{
            background:    "rgba(15,29,51,0.85)",
            border:        `1px solid ${risk.color}44`,
            color:         "rgba(255,255,255,0.9)",
            backdropFilter:"blur(8px)",
          }}
        >
          {subject.label}
        </div>

        {/* Heat Index chip — z-[20] */}
        <div
          className="absolute bottom-3 right-3 px-3 py-2 rounded-xl text-xs font-bold z-[20]"
          style={{
            background:    "rgba(10,22,40,0.85)",
            border:        `1px solid ${risk.color}44`,
            color:         risk.color,
            backdropFilter:"blur(8px)",
          }}
        >
          HI: {heatIndex.toFixed(1)}°C
        </div>
      </div>


      {/* ── DOLE Protocol Advisory Box ──────────────────────────────────────── */}
      <motion.div
        key={risk.level}
        className="rounded-2xl p-4 flex-shrink-0 overflow-y-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${risk.bg}, rgba(10,22,40,0.9))`,
          border:     `1px solid ${risk.color}44`,
          boxShadow:  `0 0 20px ${risk.glow}44`,
          maxHeight:  "min(220px, 26vh)",
        }}
      >
        <div className="flex items-start gap-3">
          {/* Colour accent bar */}
          <div
            className="flex-shrink-0 w-2 self-stretch rounded-full"
            style={{ background: risk.color, boxShadow: `0 0 8px ${risk.glow}` }}
          />

          <div className="flex-1">
            {/* Level heading */}
            <div
              className="text-xs font-black tracking-widest uppercase mb-2"
              style={{ color: risk.color }}
            >
              DOLE Protocol — {risk.level}
            </div>

            {/* Full advisory text */}
            <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>
              {doleText}
            </p>

            {/* Work / Rest schedule pills */}
            <div className="flex gap-3">
              {(
                [
                  ["WORK", risk.work, risk.level === "EXTREME DANGER" ? "#FF0033" : "white"],
                  ["REST", risk.rest, risk.textColor],
                ] as [string, string, string][]
              ).map(([label, value, colour]) => (
                <div
                  key={label}
                  className="flex-1 rounded-xl p-2 text-center"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border:     "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
                  <div className="font-black text-base" style={{ color: colour }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
