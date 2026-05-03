import { useRef, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { SUBJECTS } from "./heatUtils";

interface LeftPanelProps {
  temperature: number;
  setTemperature: (v: number) => void;
  humidity: number;
  setHumidity: (v: number) => void;
  timeOfDay: number;
  setTimeOfDay: (v: number) => void;
  selectedSubject: number;
  setSelectedSubject: (v: number) => void;
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-4 border ${className}`}
      style={{
        background: "rgba(15,29,51,0.7)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#00E5FF" }}>
      {children}
    </div>
  );
}

function HumidityTube({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const tubeRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientY: number) => {
      if (!tubeRef.current) return;
      const r = tubeRef.current.getBoundingClientRect();
      const pct = 1 - (clientY - r.top) / r.height;
      onChange(Math.round(Math.max(0, Math.min(100, pct * 100))));
    },
    [onChange]
  );

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) update(e.clientY); };
    const up = () => { dragging.current = false; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [update]);

  const TUBE_H = 150;
  // markers: pct = 0..100 maps to bottom..top of tube
  const markers = [
    { pct: 100, label: "Saturated 100%" },
    { pct: 70,  label: "Muggy 70%+" },
    { pct: 50,  label: "Comfort 40-60%" },
    { pct: 0,   label: "Arid 0%" },
  ];

  return (
    // Outer row: tube | markers
    <div className="flex items-stretch gap-2">
      {/* Tube */}
      <div
        ref={tubeRef}
        onPointerDown={(e) => { dragging.current = true; update(e.clientY); }}
        className="relative flex-shrink-0 rounded-full cursor-ns-resize select-none"
        style={{
          width: 32,
          height: TUBE_H,
          background: "rgba(255,255,255,0.07)",
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      >
        {/* Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          animate={{ height: `${value}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ background: "linear-gradient(to top, #00B4CC, #00E5FF, #7FEFFF)" }}
        />
        {/* Shine */}
        <div
          className="absolute top-0 left-1 bottom-0 rounded-full pointer-events-none"
          style={{ width: 6, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
        />
        {/* Drag handle */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          animate={{ bottom: `calc(${value}% - 5px)` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ width: 28, height: 10, background: "white", boxShadow: "0 0 8px rgba(0,229,255,0.8)" }}
        />
      </div>

      {/* Markers — positioned relative to a container that matches tube height exactly */}
      <div className="relative flex-1" style={{ height: TUBE_H }}>
        {markers.map(({ pct, label }) => {
          // top offset: pct=100 → top=0, pct=0 → top=TUBE_H
          const topPx = TUBE_H - (pct / 100) * TUBE_H;
          return (
            <div
              key={pct}
              className="absolute left-0 flex items-center gap-1"
              style={{
                top: topPx,
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <div style={{ width: 6, height: 1, background: "rgba(255,255,255,0.35)" }} />
              <span className="text-xs whitespace-nowrap">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LeftPanel({
  temperature, setTemperature,
  humidity, setHumidity,
  timeOfDay, setTimeOfDay,
  selectedSubject, setSelectedSubject,
}: LeftPanelProps) {
  const tempPct = (temperature - 20) / 38; // 20-58°C
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference * (1 - tempPct);

  const timeMarkers = [
    { h: 6, label: "6AM" }, { h: 9, label: "9AM" },
    { h: 12, label: "12PM" }, { h: 15, label: "3PM" }, { h: 18, label: "6PM" },
  ];

  const fmtTime = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, "0")}:00 ${ampm}`;
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="text-xs font-black tracking-widest uppercase pb-1" style={{ color: "rgba(0,229,255,0.6)", borderBottom: "1px solid rgba(0,229,255,0.15)" }}>
        Environment Controls
      </div>

      {/* Temperature */}
      <SectionCard>
        <Label>Air Temperature</Label>
        <div className="flex flex-col items-center gap-2">
          {/* Circular gauge */}
          <div className="relative" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke="url(#tempGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }}
              />
              <defs>
                <linearGradient id="tempGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FF6B00" />
                  <stop offset="100%" stopColor="#FF0033" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={temperature}
                className="font-black leading-none"
                style={{ fontSize: 28, color: "#FF8C00", textShadow: "0 0 20px rgba(255,140,0,0.8)" }}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
              >
                {temperature}°
              </motion.span>
              <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>CELSIUS</span>
            </div>
          </div>
          {/* Secondary display */}
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
              {temperature}°C
            </span>
            <span className="px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
              {((temperature * 9) / 5 + 32).toFixed(0)}°F
            </span>
          </div>
          {/* Slider */}
          <input
            type="range" min={20} max={58} value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between w-full text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span>20°C</span><span>58°C</span>
          </div>
        </div>
      </SectionCard>

      {/* Humidity */}
      <SectionCard>
        <Label>Relative Humidity</Label>
        {/* Value display row — sits above the tube */}
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className="font-black"
            style={{ fontSize: 32, color: "#00E5FF", textShadow: "0 0 15px rgba(0,229,255,0.6)", lineHeight: 1 }}
          >
            {humidity}
          </span>
          <span className="font-bold text-base" style={{ color: "rgba(0,229,255,0.6)" }}>%</span>
          <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>↕ drag tube</span>
        </div>
        {/* Tube + markers row */}
        <HumidityTube value={humidity} onChange={setHumidity} />
      </SectionCard>

      {/* Time of Day */}
      <SectionCard>
        <Label>Time of Day</Label>
        <div className="flex flex-col gap-2">
          <div className="font-black text-2xl text-center" style={{ color: "#FFD700", textShadow: "0 0 14px rgba(255,215,0,0.6)" }}>
            {fmtTime(timeOfDay)}
          </div>
          <input
            type="range" min={6} max={18} step={1} value={timeOfDay}
            onChange={(e) => setTimeOfDay(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            {timeMarkers.map(({ h, label }) => (
              <span
                key={h}
                className="font-semibold transition-colors"
                style={{ color: timeOfDay === h ? "#FFD700" : "rgba(255,255,255,0.35)" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Subject Select */}
      <SectionCard>
        <Label>Select Subject</Label>
        <div className="grid grid-cols-2 gap-2">
          {SUBJECTS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(i)}
              className="px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                background: selectedSubject === i ? "linear-gradient(135deg, #FF6B00, #FF3300)" : "rgba(255,255,255,0.05)",
                color: selectedSubject === i ? "white" : "rgba(255,255,255,0.5)",
                border: selectedSubject === i ? "1px solid rgba(255,107,0,0.6)" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: selectedSubject === i ? "0 0 12px rgba(255,107,0,0.4)" : "none",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
