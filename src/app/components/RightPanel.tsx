import { motion } from "motion/react";
import { FORECAST, interpolateForecast } from "./heatUtils";

interface RightPanelProps {
  heatIndex: number;
  timeOfDay: number;
  temperature: number;
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(0,229,255,0.6)" }}>
        {label}
      </div>
      <div className="font-black text-lg text-white">{value}</div>
    </div>
  );
}

function ForecastGraph({ timeOfDay }: { timeOfDay: number }) {
  const W = 200, H = 80;
  const tempMin = 25, tempMax = 44;
  const hrMin = 6, hrMax = 18;

  const toX = (h: number) => ((h - hrMin) / (hrMax - hrMin)) * W;
  const toY = (t: number) => H - ((t - tempMin) / (tempMax - tempMin)) * H;

  // Build smooth cubic bezier path
  const pts = FORECAST.map((d) => ({ x: toX(d.hour), y: toY(d.temp) }));
  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i];
    const cp1x = p0.x + (p1.x - p0.x) * 0.4;
    const cp2x = p1.x - (p1.x - p0.x) * 0.4;
    pathD += ` C ${cp1x} ${p0.y} ${cp2x} ${p1.y} ${p1.x} ${p1.y}`;
  }
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  const curH = Math.max(hrMin, Math.min(hrMax, timeOfDay));
  const curT = interpolateForecast(curH);
  const curX = toX(curH);
  const curY = toY(curT);

  const hourLabels = [
    { h: 6, l: "6AM" }, { h: 9, l: "9AM" }, { h: 12, l: "12PM" },
    { h: 15, l: "3PM" }, { h: 18, l: "6PM" },
  ];

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 16}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <line key={pct} x1="0" y1={H * (pct / 100)} x2={W} y2={H * (pct / 100)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <path d={areaD} fill="url(#areaGrad)" />
        {/* Curve */}
        <motion.path
          d={pathD} fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glowFilter)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
        />
        {/* Data points */}
        {FORECAST.map((d) => (
          <circle key={d.hour} cx={toX(d.hour)} cy={toY(d.temp)} r="3"
            fill="#FF6B00" stroke="rgba(10,22,40,0.8)" strokeWidth="1.5" />
        ))}
        {/* Current time vertical indicator */}
        <motion.line
          x1={curX} y1="0" x2={curX} y2={H}
          stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3,3"
          animate={{ x1: curX, x2: curX }}
          transition={{ type: "spring", stiffness: 80 }}
        />
        {/* Current position dot */}
        <motion.circle
          cx={curX} cy={curY} r="5"
          fill="#00E5FF" stroke="rgba(10,22,40,0.8)" strokeWidth="2"
          animate={{ cx: curX, cy: curY, r: [5, 6.5, 5] }}
          transition={{ cx: { type: "spring", stiffness: 80 }, cy: { type: "spring", stiffness: 80 }, r: { duration: 1.5, repeat: Infinity } }}
          style={{ filter: "drop-shadow(0 0 6px rgba(0,229,255,0.9))" }}
        />
        {/* Temp label at current */}
        <motion.text
          x={curX + 6} y={curY - 4}
          fontSize="7" fill="#00E5FF" fontWeight="bold"
          animate={{ x: curX + 6, y: curY - 4 }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          {curT.toFixed(0)}°C
        </motion.text>
        {/* X-axis labels */}
        {hourLabels.map(({ h, l }) => (
          <text key={h} x={toX(h)} y={H + 13} fontSize="7"
            fill="rgba(255,255,255,0.35)" textAnchor="middle"
          >
            {l}
          </text>
        ))}
        {/* Peak marker */}
        <text x={toX(15)} y={toY(41) - 6} fontSize="7" fill="#FF6B00" textAnchor="middle" fontWeight="bold">
          Peak 41°C
        </text>
      </svg>
    </div>
  );
}

export function RightPanel({ heatIndex, timeOfDay, temperature }: RightPanelProps) {
  const hiF = heatIndex * 9 / 5 + 32;
  const hiK = heatIndex + 273.15;
  const hiR = hiF + 459.67;

  return (
    <div className="flex flex-col gap-3 h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="text-xs font-black tracking-widest uppercase pb-1" style={{ color: "rgba(0,229,255,0.6)", borderBottom: "1px solid rgba(0,229,255,0.15)" }}>
        Telemetry HUD
      </div>

      {/* Heat Index Main */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(15,29,51,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,107,0,0.2)" }}
      >
        <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#00E5FF" }}>
          Heat Index
        </div>
        <motion.div
          key={Math.round(heatIndex * 10)}
          className="font-black"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "#FF6B00",
            textShadow: "0 0 25px rgba(255,107,0,0.8), 0 0 50px rgba(255,107,0,0.4)",
          }}
        >
          {heatIndex.toFixed(1)}
          <span className="text-2xl" style={{ color: "rgba(255,107,0,0.7)" }}>°C</span>
        </motion.div>
      </div>

      {/* Unit Conversion Grid */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(15,29,51,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#00E5FF" }}>
          Unit Conversions
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Fahrenheit" value={`${hiF.toFixed(1)}°F`} />
          <StatBox label="Kelvin" value={`${hiK.toFixed(1)} K`} />
          <StatBox label="Rankine" value={`${hiR.toFixed(1)}°R`} />
          <StatBox label="Ambient" value={`${temperature}°C`} />
        </div>
      </div>

      {/* Daily Forecast */}
      <div
        className="rounded-2xl p-4 flex-1"
        style={{ background: "rgba(15,29,51,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#00E5FF" }}>
          Daily Forecast — Quezon City
        </div>
        <ForecastGraph timeOfDay={timeOfDay} />
        <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          <div className="w-3 h-px" style={{ background: "#00E5FF" }} />
          <span>Current time</span>
          <div className="w-3 h-px ml-2" style={{ background: "#FF6B00" }} />
          <span>Forecast</span>
        </div>
      </div>
    </div>
  );
}
