export const SUBJECTS = [
  { id: "worker", label: "Construction Worker" },
  { id: "vendor", label: "Street Vendor" },
  { id: "enforcer", label: "Traffic Enforcer" },
  { id: "student", label: "Student" },
];

// Source: NWS Rothfusz Regression Equation (Celsius-adapted)
// Reference: Rothfusz, L.P. (1990). "The Heat Index Equation." NWS Technical Attachment SR 90-23.
// Valid range: T 27–57°C, RH 40–100%. Below 27°C or RH<40%, apparent temp ≈ ambient (SAFE by definition).
export function calcHeatIndex(temp: number, humidity: number): number {
  // Formula not valid below 27°C — return ambient temperature directly
  if (temp < 27) return temp;

  // Below 40% RH the Rothfusz equation becomes unreliable;
  // return ambient temp as apparent temp (conservative, safe default)
  if (humidity < 40) return temp;

  const T = temp, R = humidity;

  // Rothfusz regression equation (9-term polynomial, Celsius-adapted)
  const hi =
    -8.78469475556 +
     1.61139411    * T +
     2.33854883889 * R +
    -0.14611605    * T * R +
    -0.012308094   * T * T +
    -0.0164248277778 * R * R +
     0.002211732   * T * T * R +
     0.00072546    * T * R * R +
    -0.000003582   * T * T * R * R;

  // Clamp: output must be at least ambient temp; cap at 70°C (formula diverges at extremes)
  return Math.min(70, Math.max(temp, hi));
}

export type RiskLevel = "SAFE" | "CAUTION" | "EXTREME CAUTION" | "DANGER" | "EXTREME DANGER";

export interface RiskInfo {
  level: RiskLevel;
  color: string;
  glow: string;
  bg: string;
  textColor: string;
  work: string;
  rest: string;
}

export function getRisk(hi: number): RiskInfo {
  if (hi >= 54)
    return { level: "EXTREME DANGER", color: "#FF0033", glow: "rgba(255,0,51,0.8)", bg: "#3D0010", textColor: "#FF6680", work: "NONE", rest: "FULL STOP" };
  if (hi >= 41)
    return { level: "DANGER", color: "#FF4400", glow: "rgba(255,68,0,0.7)", bg: "#2D1000", textColor: "#FF9966", work: "15 min", rest: "45 min" };
  if (hi >= 32)
    return { level: "EXTREME CAUTION", color: "#FF8C00", glow: "rgba(255,140,0,0.6)", bg: "#2A1800", textColor: "#FFB84D", work: "30 min", rest: "30 min" };
  if (hi >= 27)
    return { level: "CAUTION", color: "#FFD700", glow: "rgba(255,215,0,0.6)", bg: "#1E1A00", textColor: "#FFE566", work: "45 min", rest: "15 min" };
  return { level: "SAFE", color: "#00FF88", glow: "rgba(0,255,136,0.5)", bg: "#00200E", textColor: "#66FFB2", work: "60 min", rest: "Standard" };
}

export function getDoleText(level: RiskLevel, subject: string): string {
  const s = subject;
  const map: Record<RiskLevel, string> = {
    "SAFE": `✅ NORMAL CONDITIONS for ${s}. Heat Index is within safe limits. Standard work schedule applies. Stay hydrated as a precaution.`,
    "CAUTION": `⚠️ ${s} must drink water every 20 min. Wear light clothing. Seek shade during breaks.`,
    "EXTREME CAUTION": `⚠️ ${s}: Limit strenuous activity. Mandatory shade breaks every 30 min. DOLE D.O. 102-10 applies.`,
    "DANGER": `⚠️ DOLE Protocol: ${s} allowed 15 min work / 45 min rest. Provide cold water & cooling area immediately.`,
    "EXTREME DANGER": `🚨 HALT ALL OUTDOOR OPERATIONS. Evacuate ${s} to air-conditioned facility. Call emergency services NOW.`,
  };
  return map[level];
}

// Typical QC daily forecast (hour → temp °C)
export const FORECAST: { hour: number; temp: number }[] = [
  { hour: 6, temp: 28 },
  { hour: 9, temp: 32 },
  { hour: 12, temp: 39 },
  { hour: 15, temp: 41 },
  { hour: 18, temp: 35 },
];

export function interpolateForecast(hour: number): number {
  const h = Math.max(6, Math.min(18, hour));
  for (let i = 0; i < FORECAST.length - 1; i++) {
    const a = FORECAST[i], b = FORECAST[i + 1];
    if (h >= a.hour && h <= b.hour) {
      const t = (h - a.hour) / (b.hour - a.hour);
      return a.temp + (b.temp - a.temp) * t;
    }
  }
  return FORECAST[FORECAST.length - 1].temp;
}
