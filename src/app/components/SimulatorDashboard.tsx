import { useEffect } from "react";
import { motion } from "motion/react";
import { Home } from "lucide-react";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { calcHeatIndex, getRisk, SUBJECTS } from "./heatUtils";

interface SimulatorDashboardProps {
  onBack?: () => void;
  temperature: number;
  setTemperature: (v: number) => void;
  humidity: number;
  setHumidity: (v: number) => void;
  selectedSubject: number;
  setSelectedSubject: (v: number) => void;
}

export function SimulatorDashboard({ 
  onBack,
  temperature, setTemperature,
  humidity, setHumidity,
  selectedSubject, setSelectedSubject
}: SimulatorDashboardProps) {

  const subjectData = SUBJECTS[selectedSubject];
  const heatIndex = calcHeatIndex(temperature, humidity);
  const risk = getRisk(heatIndex, subjectData.burden, subjectData.tolerance);

  return (
    <div
      className="size-full relative overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #0A1628 0%, #0D2B3E 60%, #0A1628 100%)" }}
    >
      {/* ... hex grid ... */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex-dash" width="70" height="61" patternUnits="userSpaceOnUse">
              <polygon
                points="35,3 67,20 67,55 35,72 3,55 3,20"
                fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-dash)" />
        </svg>
      </div>

      {/* Top Bar */}
      <div
        className="relative z-20 flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(0,229,255,0.1)", background: "rgba(10,22,40,0.6)", backdropFilter: "blur(10px)" }}
      >
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <Home size={16} />
            <span className="text-sm font-bold">Home</span>
          </motion.button>
        )}

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B00", boxShadow: "0 0 8px rgba(255,107,0,0.9)" }} />
          <h1 className="font-black tracking-widest text-xs sm:text-sm uppercase text-center" style={{ color: "rgba(255,255,255,0.9)" }}>
            QC Heat Risk Monitor
          </h1>
          <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B00", boxShadow: "0 0 8px rgba(255,107,0,0.9)" }} />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: "#00FF88" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[10px] sm:text-xs font-bold" style={{ color: "rgba(0,255,136,0.8)" }}>LIVE</span>
        </div>
      </div>

      {/* Main Layout - Stacks on mobile, Side-by-side on large screens */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT — Environment Controls */}
        <div className="w-full lg:w-[24%] lg:overflow-y-auto lg:flex-shrink-0 order-2 lg:order-1">
          <LeftPanel
            temperature={temperature} setTemperature={setTemperature}
            humidity={humidity} setHumidity={setHumidity}
            selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}
          />
        </div>

        {/* CENTER — Visual Display */}
        <div className="flex-1 min-h-[400px] lg:min-h-0 lg:overflow-hidden order-1 lg:order-2">
          <CenterPanel
            risk={risk}
            selectedSubject={selectedSubject}
            temperature={temperature}
            humidity={humidity}
            heatIndex={heatIndex}
          />
        </div>

        {/* RIGHT — Telemetry HUD */}
        <div className="w-full lg:w-[26%] lg:overflow-y-auto lg:flex-shrink-0 order-3">
          <RightPanel 
            heatIndex={heatIndex} 
            temperature={temperature}
            humidity={humidity}
            subject={subjectData}
          />
        </div>
      </div>
    </div>
  );
}


