// ─────────────────────────────────────────────────────────────────────────────
// heatUtils.ts
// Core logic: subjects, heat index formula, risk levels, DOLE protocol text,
// and daily forecast data for the QC Heat Risk Monitor.
//
// References:
//   • Rothfusz, L.P. (1990). "The Heat Index Equation." NWS SR 90-23.
//   • DOLE Department Order No. 102-10 (Occupational Safety & Health Standards)
//   • PAGASA Heat Index Advisory (2023 revised thresholds)
//   • OSHC Heat Stress Management Guidelines
// ─────────────────────────────────────────────────────────────────────────────

// ── Subjects / Characters ────────────────────────────────────────────────────
/**
 * Hybrid Heat Risk Model
 * 
 * Effective HI = Ambient HI + (Burden - Tolerance)
 * 
 * 1. Burden (+): External load from PPE, workload, and localized environment.
 * 2. Tolerance (-): Internal buffer from acclimatization and conditioning.
 */
export const SUBJECTS = [
  { 
    id: "worker", 
    label: "Construction Worker", 
    burden: 4.5,    // Extreme: Heavy PPE + High Metabolism (300W+)
    tolerance: 2.0, // High: Acclimatized to daily labor
    recovery: 1.0 
  },
  { 
    id: "vendor", 
    label: "Street Vendor", 
    burden: 3.0,    // High: Cooking heat + Sun exposure
    tolerance: 1.5, // High: Acclimatized to street conditions
    recovery: 0.9 
  },
  { 
    id: "enforcer", 
    label: "Traffic Enforcer", 
    burden: 3.5,    // High: Asphalt radiant heat + Polyester uniform
    tolerance: 1.5, // High: Acclimatized
    recovery: 0.95 
  },
  { 
    id: "student", 
    label: "Student", 
    burden: 1.5,    // Low: Normal clothing, sedentary
    tolerance: 0.5, // Low: Lower physiological tolerance (Young)
    recovery: 0.8 
  },
  { 
    id: "civilian", 
    label: "Civilian", 
    burden: 0.5,    // Baseline
    tolerance: 0.5, // Baseline
    recovery: 1.0 
  },
];

/**
 * Accurate NWS Heat Index calculation
 * Converts C to F, applies Steadman/Rothfusz regression with adjustments, returns C
 */
export function calcHeatIndex(tempC: number, humidity: number): number {
  const T = (tempC * 9) / 5 + 32;
  const R = humidity;

  // Simple formula for low temperatures
  let hi = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + R * 0.094);

  // Use full regression if simple HI >= 80
  if (hi >= 80) {
    hi =
      -42.379 +
      2.04901523 * T +
      10.14333127 * R -
      0.22475541 * T * R -
      0.00683783 * T * T -
      0.05481717 * R * R +
      0.00122874 * T * T * R +
      0.00085282 * T * R * R -
      0.00000199 * T * T * R * R;

    // Adjustments
    if (R < 13 && T >= 80 && T <= 112) {
      hi -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95.0)) / 17);
    } else if (R > 85 && T >= 80 && T <= 87) {
      hi += ((R - 85) / 10) * ((87 - T) / 5);
    }
  }

  const hiC = ((hi - 32) * 5) / 9;
  return Math.max(tempC, hiC);
}

/**
 * Calculates the Effective Heat Index based on the Hybrid Model
 * Effective HI = Ambient HI + (Burden - Tolerance)
 */
export function calcEffectiveHI(hi: number, burden: number, tolerance: number): number {
  return hi + (burden - tolerance);
}

// ── Risk Level Types ──────────────────────────────────────────────────────────
export type RiskLevel =
  | "SAFE"
  | "CAUTION"
  | "EXTREME CAUTION"
  | "DANGER"
  | "EXTREME DANGER";

export interface RiskInfo {
  level:     RiskLevel;
  color:     string;
  glow:      string;
  bg:        string;
  textColor: string;
  work:      string;
  rest:      string;
}

export function getRisk(hi: number, burden: number = 0, tolerance: number = 0): RiskInfo {
  // Apply Hybrid Model: Burden amplifies, Tolerance mitigates
  const effectiveHI = hi + (burden - tolerance);

  if (effectiveHI >= 52)
    return {
      level: "EXTREME DANGER",
      color: "#FF0033", glow: "rgba(255,0,51,0.8)", bg: "#3D0010",
      textColor: "#FF6680", work: "NONE", rest: "FULL STOP",
    };
  if (effectiveHI >= 42)
    return {
      level: "DANGER",
      color: "#FF4400", glow: "rgba(255,68,0,0.7)", bg: "#2D1000",
      textColor: "#FF9966", work: "15 min", rest: "45 min",
    };
  if (effectiveHI >= 33)
    return {
      level: "EXTREME CAUTION",
      color: "#FF8C00", glow: "rgba(255,140,0,0.6)", bg: "#2A1800",
      textColor: "#FFB84D", work: "30 min", rest: "30 min",
    };
  if (effectiveHI >= 27)
    return {
      level: "CAUTION",
      color: "#FFD700", glow: "rgba(255,215,0,0.6)", bg: "#1E1A00",
      textColor: "#FFE566", work: "45 min", rest: "15 min",
    };
  return {
    level: "SAFE",
    color: "#00FF88", glow: "rgba(0,255,136,0.5)", bg: "#00200E",
    textColor: "#66FFB2", work: "60 min", rest: "Standard",
  };
}


// ── DOLE Protocol Text ────────────────────────────────────────────────────────
/**
 * Returns the DOLE-compliant safety advisory for a given risk level and subject.
 *
 * Content based on:
 *   • DOLE D.O. 102-10 — Occupational Safety & Health Standards
 *   • OSHC Heat Stress Management Guidelines
 *   • PAGASA Heat Index Public Advisory
 *
 * Each level now includes specific, actionable recommendations:
 * hydration volumes/frequency, rest/shade requirements, PPE guidance,
 * symptom checklist, and medical response triggers.
 */
export function getDoleText(level: RiskLevel, subject: string): string {
  const map: Record<RiskLevel, string> = {
    "SAFE":
      `✅ NORMAL CONDITIONS for ${subject}. Heat Index is within safe limits (below 27°C). ` +
      `Standard work schedule applies. Maintain regular hydration (every 30–45 min) ` +
      `and monitor conditions throughout the day.`,

    "CAUTION":
      `⚠️ MILD HEAT STRESS — ${subject}: Drink at least 1 cup (250 mL) of water every 20 min. ` +
      `Wear lightweight, light-colored, loose-fitting clothing. Take rest in shaded areas during breaks. ` +
      `Avoid alcohol and sugary drinks. Watch for early signs of fatigue or muscle cramps.`,

    "EXTREME CAUTION":
      `⚠️ SIGNIFICANT HEAT STRESS — DOLE D.O. 102-10 applies. ${subject}: Limit strenuous activity. ` +
      `Mandatory 30-min work / 30-min shaded rest cycle. Drink water continuously (min. 1 glass every 15–20 min). ` +
      `Wear PPE rated for heat (cooling vest where available). Buddy system required — ` +
      `monitor each other for heat exhaustion symptoms: heavy sweating, weakness, cool/pale/clammy skin, nausea, headache.`,

    "DANGER":
      `🔴 SEVERE HEAT STRESS — DOLE Protocol Active. ${subject} restricted to 15 min work / 45 min rest ` +
      `with mandatory shade. Provide cold drinking water (4–8 oz every 15 min). Set up cooling station ` +
      `with ice packs or cool wet towels. Assign a safety officer to monitor workers. ` +
      `Cease all non-essential outdoor activities. Any sign of heat exhaustion (confusion, vomiting, ` +
      `no sweating) → move to cool area immediately and call medical personnel.`,

    "EXTREME DANGER":
      `🚨 LIFE-THREATENING CONDITIONS. HALT ALL OUTDOOR OPERATIONS for ${subject}. ` +
      `Evacuate immediately to an air-conditioned facility. Call emergency services (911) NOW if ` +
      `anyone shows signs of heat stroke: hot/red/dry skin, confusion, loss of consciousness, ` +
      `or body temperature above 40°C. Apply ice packs to neck, armpits, and groin while awaiting EMS. ` +
      `Do NOT resume outdoor work until Heat Index falls below 42°C.`,
  };
  return map[level];
}

