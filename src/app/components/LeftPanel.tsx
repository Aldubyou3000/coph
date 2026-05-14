// ─────────────────────────────────────────────────────────────────────────────
// LeftPanel.tsx
// Left control panel: temperature (with manual input), humidity tube,
// time-of-day slider, and subject selector.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { SUBJECTS } from "./heatUtils";

interface LeftPanelProps {
  temperature:      number;
  setTemperature:   (v: number) => void;
  humidity:         number;
  setHumidity:      (v: number) => void;
  selectedSubject:  number;
  setSelectedSubject: (v: number) => void;
}

// ── Shared card wrapper ───────────────────────────────────────────────────────
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-4 border ${className}`}
      style={{
        background:    "rgba(15,29,51,0.7)",
        backdropFilter:"blur(12px)",
        borderColor:   "rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#00E5FF" }}>
      {children}
    </div>
  );
}

// ── Custom horizontal slider (cross-browser) ─────────────────────────────────
function HorizontalSlider({
  min, max, value, onChange,
}: {
  min: number; max: number; value: number; onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const r   = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      onChange(Math.round(min + pct * (max - min)));
    },
    [min, max, onChange]
  );

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) update(e.clientX); };
    const up   = ()              => { dragging.current = false; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup",   up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup",   up);
    };
  }, [update]);

  const pct = (value - min) / (max - min);

  return (
    <div
      ref={trackRef}
      className="relative w-full select-none cursor-pointer"
      style={{ height: 28, display: "flex", alignItems: "center" }}
      onPointerDown={(e) => {
        dragging.current = true;
        update(e.clientX);
        e.preventDefault();
      }}
    >
      {/* Track — background */}
      <div
        className="absolute inset-x-0 rounded-full"
        style={{ height: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)" }}
      />
      {/* Track — filled portion */}
      <div
        className="absolute left-0 rounded-full"
        style={{
          height:     6,
          width:      `${pct * 100}%`,
          top:        "50%",
          transform:  "translateY(-50%)",
          background: "linear-gradient(90deg, #FFD700, #FF6B00, #FF0033)",
        }}
      />
      {/* Thumb */}
      <div
        className="absolute rounded-full"
        style={{
          width:      18,
          height:     18,
          left:       `calc(${pct * 100}% - 9px)`,
          top:        "50%",
          transform:  "translateY(-50%)",
          background: "white",
          boxShadow:  "0 0 10px rgba(255,140,0,0.9), 0 2px 4px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.15s",
        }}
      />
    </div>
  );
}

// ── Temperature Control (circular gauge + slider + MANUAL INPUT) ──────────────
/**
 * The circular °C value is now clickable. Clicking it switches the display
 * into an <input type="number"> that accepts any value in [20, 58].
 *
 * Synchronisation rules:
 *  • Typing a valid in-range integer → updates state in real-time (slider + gauge move instantly)
 *  • Arrow Up / Down while focused → increment / decrement by 1°C
 *  • Enter or Escape → commits and exits edit mode
 *  • Blur (click away) → commits and exits edit mode
 *  • Out-of-range or non-numeric → reverts to last valid value on commit
 *  • Moving the slider while editing → exits edit mode and updates normally
 */
function TemperatureControl({
  temperature,
  setTemperature,
}: {
  temperature: number;
  setTemperature: (v: number) => void;
}) {
  const [editing, setEditing]   = useState(false);
  const [rawValue, setRawValue] = useState(String(temperature));
  const inputRef                = useRef<HTMLInputElement>(null);

  // Keep rawValue in sync when slider moves (only when NOT in edit mode)
  useEffect(() => {
    if (!editing) setRawValue(String(temperature));
  }, [temperature, editing]);

  // Auto-focus the input as soon as editing starts
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // Gauge arc geometry
  const tempPct      = (temperature - 20) / 38; // 20–58 °C → 0–1
  const circumference = 2 * Math.PI * 38;
  const dashOffset   = circumference * (1 - tempPct);

  // Called on every keystroke
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setRawValue(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 20 && parsed <= 58) {
      setTemperature(parsed);
    }
  };

  const handleCommit = () => {
    const parsed = parseInt(rawValue, 10);
    if (isNaN(parsed) || parsed < 20 || parsed > 58) {
      setRawValue(String(temperature)); // revert
    } else {
      setTemperature(Math.min(58, Math.max(20, parsed)));
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") handleCommit();
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setTemperature(Math.min(58, temperature + 1));
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setTemperature(Math.max(20, temperature - 1));
    }
  };

  return (
    <SectionCard>
      <Label>Air Temperature</Label>
      <div className="flex flex-col items-center gap-2">
        <div className="relative" style={{ width: 110, height: 110 }}>
          <svg width="110" height="110" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="38"
              fill="none"
              stroke="url(#tempGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transform:       "rotate(-90deg)",
                transformOrigin: "50px 50px",
                transition:      "stroke-dashoffset 0.35s ease",
              }}
            />
            <defs>
              <linearGradient id="tempGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#FFD700" />
                <stop offset="50%"  stopColor="#FF6B00" />
                <stop offset="100%" stopColor="#FF0033" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {editing ? (
              <input
                ref={inputRef}
                type="number"
                value={rawValue}
                onChange={handleManualChange}
                onBlur={handleCommit}
                onKeyDown={handleKeyDown}
                className="font-black text-center bg-transparent border-none focus:outline-none w-24"
                style={{
                  fontSize:   28,
                  color:      "#FF8C00",
                  textShadow: "0 0 20px rgba(255,140,0,0.8)",
                }}
              />
            ) : (
              <motion.span
                key={temperature}
                onClick={() => setEditing(true)}
                className="font-black leading-none cursor-pointer"
                style={{ fontSize: 28, color: "#FF8C00", textShadow: "0 0 20px rgba(255,140,0,0.8)" }}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
              >
                {temperature}°
              </motion.span>
            )}
            <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
              {editing ? "ENTER °C" : "CELSIUS"}
            </span>
          </div>
        </div>

        <HorizontalSlider
          min={20}
          max={58}
          value={temperature}
          onChange={(v) => {
            setEditing(false);
            setTemperature(v);
          }}
        />
        <div className="flex justify-between w-full text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>20°C</span>
          <span>58°C</span>
        </div>
      </div>
    </SectionCard>
  );
}

// ── Humidity Tube (drag-to-set vertical control) ──────────────────────────────
function HumidityTube({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const tubeRef  = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const TUBE_H   = 150;

  const update = useCallback(
    (clientY: number) => {
      if (!tubeRef.current) return;
      const r   = tubeRef.current.getBoundingClientRect();
      const pct = 1 - (clientY - r.top) / r.height;
      onChange(Math.round(Math.max(0, Math.min(100, pct * 100))));
    },
    [onChange]
  );

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) update(e.clientY); };
    const up   = () => { dragging.current = false; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup",   up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup",   up);
    };
  }, [update]);

  const markers = [
    { pct: 100, label: "Saturated 100%" },
    { pct: 70,  label: "Muggy 70%+"     },
    { pct: 50,  label: "Comfort 40–60%" },
    { pct: 0,   label: "Arid 0%"        },
  ];

  return (
    <div className="flex items-stretch gap-2">
      {/* Tube */}
      <div
        ref={tubeRef}
        onPointerDown={(e) => { dragging.current = true; update(e.clientY); }}
        className="relative flex-shrink-0 rounded-full cursor-ns-resize select-none"
        style={{
          width: 32, height: TUBE_H,
          background: "rgba(255,255,255,0.07)",
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      >
        {/* Liquid fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          animate={{ height: `${value}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ background: "linear-gradient(to top, #00B4CC, #00E5FF, #7FEFFF)" }}
        />
        {/* Glass shine */}
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

      {/* Labels */}
      <div className="relative flex-1" style={{ height: TUBE_H }}>
        {markers.map(({ pct, label }) => (
          <div
            key={pct}
            className="absolute left-0 flex items-center gap-1"
            style={{
              top:       TUBE_H - (pct / 100) * TUBE_H,
              transform: "translateY(-50%)",
              color:     "rgba(255,255,255,0.45)",
            }}
          >
            <div style={{ width: 6, height: 1, background: "rgba(255,255,255,0.35)" }} />
            <span className="text-xs whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function LeftPanel({
  temperature, setTemperature,
  humidity,    setHumidity,
  selectedSubject, setSelectedSubject,
}: LeftPanelProps) {

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto" style={{ minWidth: 0 }}>

      {/* Panel header */}
      <div
        className="text-xs font-black tracking-widest uppercase pb-1"
        style={{ color: "rgba(0,229,255,0.6)", borderBottom: "1px solid rgba(0,229,255,0.15)" }}
      >
        Environment Controls
      </div>

      {/* ── Temperature (with manual input) ── */}
      <TemperatureControl temperature={temperature} setTemperature={setTemperature} />

      {/* ── Humidity ── */}
      <SectionCard>
        <Label>Relative Humidity</Label>
        {/* Value display */}
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
        {/* Drag tube */}
        <HumidityTube value={humidity} onChange={setHumidity} />
      </SectionCard>


      {/* ── Subject Selector ── */}
      <SectionCard>
        <Label>Select Subject</Label>
        {/* 5 subjects → 2-col grid (last button spans if odd count) */}
        <div className="grid grid-cols-2 gap-2">
          {SUBJECTS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(i)}
              className="px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                background: selectedSubject === i
                  ? "linear-gradient(135deg, #FF6B00, #FF3300)"
                  : "rgba(255,255,255,0.05)",
                color:  selectedSubject === i ? "white" : "rgba(255,255,255,0.5)",
                border: selectedSubject === i
                  ? "1px solid rgba(255,107,0,0.6)"
                  : "1px solid rgba(255,255,255,0.1)",
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
