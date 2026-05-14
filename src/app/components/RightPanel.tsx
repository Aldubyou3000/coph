// ─────────────────────────────────────────────────────────────────────────────
// RightPanel.tsx
// Right telemetry panel: heat index display, formula validation info,
// unit conversions, QC daily forecast graph, and PAGASA threshold legend.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "motion/react";

interface RightPanelProps {
  heatIndex:   number;
  temperature: number;
  humidity:    number;
  subject:     any; // From SUBJECTS array
}

// ── Shared stat box ───────────────────────────────────────────────────────────
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "rgba(255,255,255,0.05)",
        border:     "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="text-xs font-bold tracking-widest uppercase mb-1"
        style={{ color: "rgba(0,229,255,0.6)" }}
      >
        {label}
      </div>
      <div className="font-black text-lg text-white">{value}</div>
    </div>
  );
}

// ── Stress Profile Visualizer ─────────────────────────────────────────────────
function StressProfile({ subject }: { subject: any }) {
  const { burden, tolerance } = subject;
  
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{
        background:    "rgba(15,29,51,0.7)",
        backdropFilter:"blur(12px)",
        border:        "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="text-[10px] font-black tracking-widest uppercase text-[#00E5FF] opacity-70">
        Physiological Stress Profile
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Burden Indicator */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-red-400 uppercase">
            <span>Heat Burden</span>
            <span>+{burden.toFixed(1)}°C</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-red-600 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${(burden / 5) * 100}%` }}
            />
          </div>
          <div className="text-[9px] text-white/40 italic leading-tight">
            PPE / METABOLISM / RADIANT HEAT
          </div>
        </div>

        {/* Tolerance Indicator */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-emerald-400 uppercase">
            <span>Heat Tolerance</span>
            <span>-{tolerance.toFixed(1)}°C</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${(tolerance / 5) * 100}%` }}
            />
          </div>
          <div className="text-[9px] text-white/40 italic leading-tight">
            ACCLIMATIZATION / CONDITIONING
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Formula validation info panel ─────────────────────────────────────────────
function FormulaInfo({
  temperature,
  humidity,
  heatIndex,
  subject,
}: {
  temperature: number;
  humidity:    number;
  heatIndex:   number;
  subject:     any;
}) {
  const formulaActive = temperature >= 27 && humidity >= 25;
  const delta         = heatIndex - temperature;
  const effectiveHI   = heatIndex + (subject.burden - subject.tolerance);

  return (
    <div
      className="rounded-xl p-3 mt-2"
      style={{
        background: "rgba(255,255,255,0.03)",
        border:     "1px solid rgba(255,255,255,0.06)",
        fontSize:   11,
      }}
    >
      <div
        className="text-xs font-bold tracking-widest uppercase mb-2"
        style={{ color: "rgba(0,229,255,0.5)" }}
      >
        Formula Status
      </div>

      <div className="flex justify-between items-center mb-1">
        <span style={{ color: "rgba(255,255,255,0.45)" }}>Rothfusz valid</span>
        <span
          className="font-bold"
          style={{ color: formulaActive ? "#00FF88" : "#FFD700" }}
        >
          {formulaActive ? "YES" : "Below threshold"}
        </span>
      </div>

      {!formulaActive && (
        <div className="mb-1" style={{ color: "rgba(255,200,0,0.6)", fontSize: 10 }}>
          {temperature < 27
            ? "T < 27°C — apparent temp ≈ ambient"
            : "RH < 25% — evaporation too efficient"}
        </div>
      )}

      <div className="flex justify-between items-center mb-1">
        <span style={{ color: "rgba(255,255,255,0.45)" }}>Environmental HI</span>
        <span className="font-bold" style={{ color: "rgba(0,229,255,0.8)" }}>
          {heatIndex.toFixed(1)}°C
        </span>
      </div>

      <div className="flex justify-between items-center mb-1">
        <span style={{ color: "rgba(255,255,255,0.45)" }}>Feels hotter by</span>
        <span className="font-bold" style={{ color: "rgba(0,229,255,0.8)" }}>
          +{delta.toFixed(1)}°C
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span style={{ color: "rgba(255,255,255,0.45)" }}>Apparent temp</span>
        <span className="font-bold" style={{ color: "#FF6B00" }}>
          {heatIndex.toFixed(2)}°C
        </span>
      </div>
    </div>
  );
}


// ── PAGASA threshold legend ───────────────────────────────────────────────────
function PageasaLegend() {
  const levels = [
    { range: "< 27°C",    label: "SAFE",            color: "#00FF88" },
    { range: "27–32°C",   label: "CAUTION",         color: "#FFD700" },
    { range: "33–41°C",   label: "EXTREME CAUTION", color: "#FF8C00" },
    { range: "42–51°C",   label: "DANGER",          color: "#FF4400" },
    { range: "≥ 52°C",    label: "EXTREME DANGER",  color: "#FF0033" },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background:    "rgba(15,29,51,0.7)",
        backdropFilter:"blur(12px)",
        border:        "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="text-xs font-bold tracking-widest uppercase mb-3"
        style={{ color: "#00E5FF" }}
      >
        PAGASA Thresholds
      </div>
      {levels.map(({ range, label, color }) => (
        <div
          key={label}
          className="flex items-center gap-2 mb-1.5"
        >
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: color, flexShrink: 0,
              boxShadow: `0 0 4px ${color}88`,
            }}
          />
          <span className="text-xs flex-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {range}
          </span>
          <span className="text-xs font-bold" style={{ color }}>
            {label}
          </span>
        </div>
      ))}
      <p className="mt-2" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
        Source: PAGASA Heat Index Advisory (2023) &amp; DOLE D.O. 102-10
      </p>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function RightPanel({ heatIndex, temperature, humidity, subject }: RightPanelProps) {
  const hiF = heatIndex * 9 / 5 + 32;
  const hiK = heatIndex + 273.15;
  const hiR = hiF + 459.67;
  const effectiveHI = heatIndex + (subject.burden - subject.tolerance);

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1" style={{ minWidth: 0 }}>

      <div
        className="text-xs font-black tracking-widest uppercase pb-1"
        style={{ color: "rgba(0,229,255,0.6)", borderBottom: "1px solid rgba(0,229,255,0.15)" }}
      >
        Telemetry HUD
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          background:    "rgba(15,29,51,0.7)",
          backdropFilter:"blur(12px)",
          border:        "1px solid rgba(255,107,0,0.2)",
        }}
      >
        <div
          className="text-xs font-bold tracking-widest uppercase mb-2"
          style={{ color: "#00E5FF" }}
        >
          Heat Index
        </div>

        <motion.div
          key={Math.round(effectiveHI * 10)}
          className="font-black"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          style={{
            fontSize:   "clamp(2rem, 4vw, 3rem)",
            color:      "#FF6B00",
            textShadow: "0 0 25px rgba(255,107,0,0.8), 0 0 50px rgba(255,107,0,0.4)",
          }}
        >
          {effectiveHI.toFixed(1)}
          <span className="text-2xl" style={{ color: "rgba(255,107,0,0.7)" }}>°C</span>
        </motion.div>

        <FormulaInfo
          temperature={temperature}
          humidity={humidity}
          heatIndex={heatIndex}
          subject={subject}
        />
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          background:    "rgba(15,29,51,0.7)",
          backdropFilter:"blur(12px)",
          border:        "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "#00E5FF" }}
        >
          Unit Conversions
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Fahrenheit" value={`${hiF.toFixed(1)}°F`} />
          <StatBox label="Kelvin"     value={`${hiK.toFixed(1)} K`} />
          <StatBox label="Rankine"    value={`${hiR.toFixed(1)}°R`} />
          <StatBox label="Ambient"    value={`${temperature}°C`}    />
        </div>
      </div>

      <PageasaLegend />
      
      {/* Moved Stress Profile — specifically requested under the Legend */}
      <StressProfile subject={subject} />
    </div>
  );
}
