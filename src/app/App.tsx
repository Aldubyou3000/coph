import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LandingPage } from "./components/LandingPage";
import { SimulatorDashboard } from "./components/SimulatorDashboard";

export default function App() {
  const [screen, setScreen] = useState<"landing" | "simulator">("landing");

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
            <SimulatorDashboard onBack={() => setScreen("landing")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}