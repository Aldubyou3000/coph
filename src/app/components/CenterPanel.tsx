import { motion, AnimatePresence } from "motion/react";
import { ConstructionWorker, TrafficEnforcer, Student, StreetVendor } from "./Characters";
import { RiskInfo, getDoleText, SUBJECTS } from "./heatUtils";
import { CityScene } from "./CityScene";

const CharacterComponents = [ConstructionWorker, StreetVendor, TrafficEnforcer, Student];

interface CenterPanelProps {
  risk: RiskInfo;
  selectedSubject: number;
  temperature: number;
  humidity: number;
  heatIndex: number;
}

export function CenterPanel({ risk, selectedSubject, temperature, humidity, heatIndex }: CenterPanelProps) {
  const Char = CharacterComponents[selectedSubject];
  const subject = SUBJECTS[selectedSubject];
  const doleText = getDoleText(risk.level, subject.label);

  // ── Official Heat Index Thresholds (DOLE / NWS) ──
  // All visual effects are keyed to these exact levels
  const isSafe       = risk.level === "SAFE";                          // HI < 27
  const isCaution    = risk.level === "CAUTION";                       // HI 27–31
  const isExtCaution = risk.level === "EXTREME CAUTION";               // HI 32–40
  const isDanger     = risk.level === "DANGER";                        // HI 41–53
  const isExtreme    = risk.level === "EXTREME DANGER";                // HI ≥ 54
  const isDangerPlus = isDanger || isExtreme;                          // HI ≥ 41
  const isCautionPlus = isCaution || isExtCaution || isDangerPlus;     // HI ≥ 27

  // Sweat count per threshold — more sweat = more danger, instantly readable
  const sweatDrops = isExtreme ? 8 : isDanger ? 6 : isExtCaution ? 4 : isCaution ? 2 : 0;
  // Haze line count per level
  const hazeCount = isExtreme ? 10 : isDanger ? 8 : isExtCaution ? 5 : 0;
  // Rising particle count
  const particleCount = isExtreme ? 18 : isDanger ? 12 : isExtCaution ? 6 : isCaution ? 2 : 0;
  // Ember count (danger+ only)
  const emberCount = isExtreme ? 15 : isDanger ? 8 : 0;
  // Viewport sweat drop count
  const viewportSweatCount = isExtreme ? 10 : isDanger ? 6 : isExtCaution ? 3 : 0;

  return (
    <div className="flex flex-col gap-3 h-full" style={{ minWidth: 0 }}>

      {/* Risk Level Banner */}
      <motion.div
        className="relative overflow-hidden rounded-2xl flex items-center justify-center py-4"
        animate={{
          boxShadow: isExtreme
            ? [`0 0 30px ${risk.glow}`, `0 0 60px ${risk.glow}`, `0 0 30px ${risk.glow}`]
            : [`0 0 15px ${risk.glow}`, `0 0 30px ${risk.glow}`, `0 0 15px ${risk.glow}`],
        }}
        transition={{ duration: isExtreme ? 0.8 : 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: `linear-gradient(135deg, ${risk.bg}, rgba(0,0,0,0.4))`, border: `1px solid ${risk.color}33` }}
      >
        {/* Pulse BG for extreme */}
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
          animate={isExtreme
            ? { scale: [1, 1.04, 1], opacity: 1 }
            : { scale: 1, opacity: 1 }}
          transition={isExtreme
            ? { scale: { duration: 0.8, repeat: Infinity }, opacity: { duration: 0.3 } }
            : { duration: 0.3 }}
          style={{
            fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
            color: risk.color,
            textShadow: `0 0 30px ${risk.glow}, 0 0 60px ${risk.glow}`,
          }}
        >
          {risk.level}
        </motion.div>
      </motion.div>

      {/* Character Display */}
      <div
        className="relative flex-1 rounded-2xl overflow-hidden flex items-end justify-center"
        style={{
          background: "#0A1628",
          border: `1px solid ${risk.color}22`,
          minHeight: 200,
        }}
      >
        {/* 3D City Background — z-0, lit by Heat Index */}
        <CityScene temperature={heatIndex} />

        {/* ── SVG Filter Definition for Heat Distortion ── */}
        <svg className="absolute" width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="heat-distortion">
              {/* Turbulence creates the wavy noise pattern */}
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

        {/* Heat Distortion — starts at EXTREME CAUTION (HI ≥ 32) */}
        {(isExtCaution || isDangerPlus) && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{ filter: "url(#heat-distortion)", background: "transparent" }}
          />
        )}

        {/* ── Humidity / Moisture Overlay ── */}
        {/* Low humidity = clear/dry. High humidity = misty vapor, condensation feel */}
        {humidity > 50 && (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              // Misty white overlay that increases with humidity
              background: `radial-gradient(ellipse at center bottom,
                rgba(200, 220, 255, ${Math.min((humidity - 50) * 0.006, 0.3)}) 0%,
                rgba(180, 210, 245, ${Math.min((humidity - 50) * 0.004, 0.2)}) 40%,
                transparent 80%
              )`,
              backdropFilter: humidity > 70 ? `blur(${Math.min((humidity - 70) * 0.05, 1.5)}px)` : "none",
            }}
          />
        )}

        {/* Animated vapor wisps — appear at high humidity */}
        {humidity > 60 && Array.from({ length: Math.min(Math.floor((humidity - 60) / 8), 5) }).map((_, i) => (
          <motion.div
            key={`vapor-${i}`}
            className="absolute pointer-events-none z-[1]"
            style={{
              width: "60%",
              height: 30 + i * 10,
              bottom: `${5 + i * 12}%`,
              left: `${10 + i * 8}%`,
              background: `linear-gradient(90deg,
                transparent,
                rgba(200, 220, 255, ${0.06 + (humidity - 60) * 0.002}),
                rgba(220, 235, 255, ${0.08 + (humidity - 60) * 0.003}),
                rgba(200, 220, 255, ${0.06 + (humidity - 60) * 0.002}),
                transparent
              )`,
              borderRadius: "50%",
              filter: `blur(${8 + i * 3}px)`,
            }}
            animate={{
              x: ["-10%", "10%", "-10%"],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Risk color tint overlay — z-[1] */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[1]"
          animate={{ opacity: isExtreme ? [0.2, 0.45, 0.2] : isDanger ? [0.15, 0.3, 0.15] : [0.05, 0.15, 0.05] }}
          transition={{ duration: isExtreme ? 0.8 : isDanger ? 1.5 : 3, repeat: Infinity }}
          style={{ background: `radial-gradient(ellipse at center, ${risk.color}30, transparent 70%)` }}
        />

        {/* Heat haze lines — EXTREME CAUTION+ (HI ≥ 32) */}
        {hazeCount > 0 && Array.from({ length: hazeCount }).map((_, i) => (
          <motion.div
            key={`haze-${i}`}
            className="absolute inset-x-0 pointer-events-none z-[2]"
            style={{ height: isExtreme ? 4 : 3, background: `linear-gradient(90deg, transparent, ${risk.color}${isExtreme ? '60' : '40'}, transparent)`, top: `${8 + i * (90 / hazeCount)}%` }}
            animate={{ x: ["-100%", "100%"], opacity: [0, isExtreme ? 1 : 0.8, 0] }}
            transition={{ duration: isExtreme ? 0.8 + i * 0.1 : 1.2 + i * 0.15, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
          />
        ))}

        {/* Rising heat particles — CAUTION+ (HI ≥ 27) */}
        {particleCount > 0 && Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={`heat-p-${i}`}
            className="absolute rounded-full pointer-events-none z-[2]"
            style={{
              width: isExtreme ? 5 + (i % 3) * 3 : 3 + (i % 3) * 2,
              height: isExtreme ? 5 + (i % 3) * 3 : 3 + (i % 3) * 2,
              left: `${5 + (i * (90 / particleCount)) % 90}%`,
              bottom: "5%",
              background: `radial-gradient(circle, ${risk.color}CC, transparent)`,
            }}
            animate={{ y: [0, isExtreme ? -450 : -350], opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.3] }}
            transition={{ duration: isExtreme ? 1.5 + (i % 4) * 0.3 : 2.5 + (i % 4) * 0.5, repeat: Infinity, delay: i * 0.2, ease: "easeOut" }}
          />
        ))}

        {/* Viewport Sweat Drops — EXTREME CAUTION+ (HI ≥ 32) */}
        {viewportSweatCount > 0 && Array.from({ length: viewportSweatCount }).map((_, i) => (
          <motion.div
            key={`sweat-${i}`}
            className="absolute pointer-events-none z-[3]"
            style={{
              width: 10 + (i % 3) * 5,
              height: 18 + (i % 4) * 8,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: `linear-gradient(180deg, rgba(180, 230, 255, 0.7), rgba(120, 200, 255, 0.5))`,
              boxShadow: `0 3px 6px rgba(0, 150, 255, 0.3), inset 0 -2px 4px rgba(255,255,255,0.4), inset 0 2px 3px rgba(200, 240, 255, 0.3)`,
              ...(i % 3 === 0
                ? { left: `${3 + i * 2}%`, top: `${10 + i * 8}%` }
                : i % 3 === 1
                ? { right: `${3 + i * 2}%`, top: `${15 + i * 7}%` }
                : { left: `${20 + i * 10}%`, top: `${3}%` }
              ),
            }}
            animate={{
              y: [0, 60 + i * 20, 120 + i * 30],
              opacity: [0.9, 0.7, 0],
              scaleY: [1, 1.8, 2.5],
              scaleX: [1, 0.7, 0.4],
            }}
            transition={{
              duration: isExtreme ? 2.5 + i : 4 + i * 1.5,
              repeat: Infinity,
              delay: i * (isExtreme ? 0.6 : 1.2),
              ease: "easeIn",
            }}
          />
        ))}

        {/* Floating Heat Stress Embers — DANGER+ only (HI ≥ 41) */}
        {emberCount > 0 && Array.from({ length: emberCount }).map((_, i) => (
          <motion.div
            key={`ember-${i}`}
            className="absolute pointer-events-none z-[3]"
            style={{
              width: isExtreme ? 3 + (i % 3) * 2 : 2 + (i % 3),
              height: isExtreme ? 3 + (i % 3) * 2 : 2 + (i % 3),
              borderRadius: "50%",
              left: `${8 + (i * 11) % 84}%`,
              bottom: `${(i * 13) % 40}%`,
              background: isExtreme
                ? `radial-gradient(circle, #FF0033, #FF4400, transparent)`
                : `radial-gradient(circle, #FF6600, #FF8800, transparent)`,
              boxShadow: isExtreme
                ? `0 0 8px rgba(255, 0, 51, 0.9), 0 0 16px rgba(255, 0, 51, 0.5)`
                : `0 0 4px rgba(255, 100, 0, 0.6)`,
            }}
            animate={{
              y: [0, -120 - i * 30],
              x: [0, (i % 2 === 0 ? 20 : -20), (i % 2 === 0 ? -10 : 10)],
              opacity: [0, 1, 0.8, 0],
              scale: [0.3, isExtreme ? 1.5 : 1, 0.5],
            }}
            transition={{
              duration: isExtreme ? 2 + (i % 3) : 3 + (i % 3) * 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Viewport Edge Heat Vignette — DANGER+ only (HI ≥ 41) */}
        {isDangerPlus && (
          <div
            className="absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: `radial-gradient(ellipse at center,
                transparent ${isExtreme ? '40%' : '50%'},
                rgba(${isExtreme ? '255, 0, 51' : '255, 100, 0'}, ${isExtreme ? 0.35 : 0.2}) 85%,
                rgba(${isExtreme ? '200, 0, 20' : '200, 50, 0'}, ${isExtreme ? 0.45 : 0.3}) 100%
              )`,
            }}
          />
        )}

        {/* ── Humidity Viewport Sweat — condensation driven by humidity ── z-[4] */}
        {humidity > 55 && Array.from({ length: Math.min(Math.floor((humidity - 55) / 5), 10) }).map((_, i) => (
          <motion.div
            key={`humid-drop-${i}`}
            className="absolute pointer-events-none z-[4]"
            style={{
              width: 8 + (i % 4) * 4,
              height: 14 + (i % 3) * 8,
              borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
              background: `linear-gradient(180deg,
                rgba(200, 235, 255, 0.75),
                rgba(150, 210, 255, 0.55)
              )`,
              boxShadow: '0 2px 6px rgba(100, 180, 255, 0.35), inset 0 -2px 4px rgba(255,255,255,0.5), inset 0 2px 3px rgba(220,245,255,0.4)',
              ...(i % 4 === 0
                ? { left: `${2 + i * 3}%`, top: `${5 + (i * 11) % 30}%` }
                : i % 4 === 1
                ? { right: `${2 + i * 2}%`, top: `${8 + (i * 9) % 35}%` }
                : i % 4 === 2
                ? { left: `${15 + (i * 13) % 60}%`, top: '2%' }
                : { left: `${10 + (i * 17) % 70}%`, top: `${5 + (i * 7) % 20}%` }
              ),
            }}
            animate={{
              y: [0, 40 + i * 15, 100 + i * 25, 180 + i * 20],
              opacity: [0, 0.9, 0.7, 0],
              scaleY: [0.8, 1, 1.5, 2.5],
              scaleX: [1, 0.9, 0.7, 0.3],
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              delay: i * 1.8,
              ease: 'easeIn',
            }}
          />
        ))}

        {/* Humidity film — subtle wet sheen on the viewport at very high humidity */}
        {humidity > 75 && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-[4]"
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `linear-gradient(180deg,
                rgba(180, 210, 255, ${Math.min((humidity - 75) * 0.008, 0.15)}) 0%,
                transparent 30%,
                transparent 70%,
                rgba(180, 210, 255, ${Math.min((humidity - 75) * 0.006, 0.1)}) 100%
              )`,
            }}
          />
        )}

        {/* Character — z-[10] */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSubject}
            className="relative z-[10]"
            style={{ width: 300, height: 460 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: isExtreme ? [-2, 2, -2] : [0, -6, 0],
              x: isExtreme ? [-2, 2, -1, 2, -2] : 0,
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              y: { duration: isExtreme ? 0.3 : 2.5, repeat: Infinity, ease: "easeInOut" },
              x: isExtreme ? { duration: 0.15, repeat: Infinity } : {},
            }}
          >
            {/* Heat Aura — CAUTION+ (HI ≥ 27), intensity per threshold */}
            {isCautionPlus && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 40%,
                    ${isExtreme ? 'rgba(255, 0, 30, 0.4)' : isDanger ? 'rgba(255, 68, 0, 0.3)' : isExtCaution ? 'rgba(255, 140, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)'} 0%,
                    ${isExtreme ? 'rgba(255, 30, 0, 0.25)' : isDanger ? 'rgba(255, 100, 0, 0.15)' : isExtCaution ? 'rgba(255, 180, 30, 0.08)' : 'rgba(255, 215, 0, 0.04)'} 35%,
                    transparent 70%
                  )`,
                  filter: `blur(${isDangerPlus ? 10 : 5}px)`,
                  transform: 'scale(1.3, 1.2)',
                }}
                animate={{
                  opacity: isExtreme ? [0.7, 1, 0.7] : isDanger ? [0.5, 0.8, 0.5] : isExtCaution ? [0.3, 0.5, 0.3] : [0.2, 0.35, 0.2],
                  scale: isExtreme ? [1.25, 1.45, 1.25] : isDanger ? [1.2, 1.35, 1.2] : [1.15, 1.25, 1.15],
                }}
                transition={{ duration: isExtreme ? 0.6 : isDanger ? 1 : 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Heat shimmer ring — DANGER+ (HI ≥ 41) */}
            {isDangerPlus && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  border: `${isExtreme ? 3 : 2}px solid ${isExtreme ? 'rgba(255, 0, 30, 0.4)' : 'rgba(255, 100, 0, 0.25)'}`,
                  borderRadius: '50%',
                  transform: 'scale(1.1)',
                  filter: 'blur(3px)',
                }}
                animate={{
                  scale: [1.1, isExtreme ? 1.6 : 1.4, 1.1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: isExtreme ? 1.2 : 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            <Char />

            {/* Sweat drops */}
            {Array.from({ length: sweatDrops }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 5, height: 8,
                  left: `${20 + i * 12}%`,
                  top: "20%",
                  background: "linear-gradient(to bottom, #7FEFFF, #00B4CC)",
                  boxShadow: "0 0 4px rgba(0,229,255,0.6)",
                }}
                animate={{ y: [0, 80], opacity: [0.9, 0], scaleY: [1, 0.6] }}
                transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.22, ease: "easeIn" }}
              />
            ))}

            {/* Water pouring - construction worker at DANGER+ (HI ≥ 41) */}
            {selectedSubject === 0 && isDangerPlus && (
              <div className="absolute" style={{ top: "8%", right: "10%" }}>
                {Array.from({ length: isExtreme ? 8 : 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{ width: isExtreme ? 4 : 3, height: isExtreme ? 12 : 8, left: i * 4, background: "rgba(0,180,255,0.7)" }}
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
            background: "rgba(15,29,51,0.85)",
            border: `1px solid ${risk.color}44`,
            color: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
          }}
        >
          {subject.label}
        </div>

        {/* Heat Index overlay — z-[20] */}
        <div
          className="absolute bottom-3 right-3 px-3 py-2 rounded-xl text-xs font-bold z-[20]"
          style={{
            background: "rgba(10,22,40,0.85)",
            border: `1px solid ${risk.color}44`,
            color: risk.color,
            backdropFilter: "blur(8px)",
          }}
        >
          HI: {heatIndex.toFixed(1)}°C
        </div>
      </div>

      {/* DOLE Protocol Box */}
      <motion.div
        key={risk.level}
        className="rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${risk.bg}, rgba(10,22,40,0.9))`,
          border: `1px solid ${risk.color}44`,
          boxShadow: `0 0 20px ${risk.glow}44`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-2 self-stretch rounded-full"
            style={{ background: risk.color, boxShadow: `0 0 8px ${risk.glow}` }}
          />
          <div className="flex-1">
            <div className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: risk.color }}>
              DOLE Protocol — {risk.level}
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>
              {doleText}
            </p>
            <div className="flex gap-3">
              <div
                className="flex-1 rounded-xl p-2 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>WORK</div>
                <div className="font-black text-base" style={{ color: risk.level === "EXTREME DANGER" ? "#FF0033" : "white" }}>
                  {risk.work}
                </div>
              </div>
              <div
                className="flex-1 rounded-xl p-2 text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>REST</div>
                <div className="font-black text-base" style={{ color: risk.textColor }}>
                  {risk.rest}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
