import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LandingPage } from "./components/LandingPage";
import { SimulatorDashboard } from "./components/SimulatorDashboard";

export default function App() {
  const [screen, setScreen] = useState<"landing" | "simulator">("landing");
  
  // Lifted state for persistence
  const [temperature, setTemperature] = useState(20);
  const [humidity, setHumidity] = useState(55);
  const [selectedSubject, setSelectedSubject] = useState(4);

  return (
    <div className="size-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <motion.div
            key="landing"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStart={() => setScreen("simulator")} />
          </motion.div>
        )}
        {screen === "simulator" && (
          <motion.div
            key="simulator"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SimulatorDashboard 
              onBack={() => setScreen("landing")} 
              temperature={temperature}
              setTemperature={setTemperature}
              humidity={humidity}
              setHumidity={setHumidity}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}