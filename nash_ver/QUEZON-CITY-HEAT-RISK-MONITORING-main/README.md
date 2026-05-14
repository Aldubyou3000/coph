# QC Heat Risk Monitor

A real-time Heat Stroke Risk Assessment & DOLE Policy Simulator for Quezon City.

## Overview

This application simulates heat stroke risk for outdoor workers based on DOLE Department Order No. 102-10. It provides real-time heat index calculations, risk level assessments, and recommended work/rest protocols for different types of outdoor subjects (Construction Workers, Traffic Enforcers, Students, Street Vendors).

## Features

- **Interactive Environment Controls**: Adjust Temperature, Humidity, and Time of Day.
- **Heat Index Calculation**: Real-time apparent temperature calculation using the Rothfusz Regression Equation (NWS, Celsius-adapted).
- **DOLE Protocol Checker**: Automatically determines the required safety protocols (Safe, Caution, Extreme Caution, Danger, Extreme Danger).
- **Telemetry HUD**: View daily temperature forecast graphs and unit conversions.
- **3D Visualization**: Real-time 3D city environment that visually reacts to heat risk levels.

---

## 🛠 Setup & Installation Guide for Developers

Since this project will be handled by a group, it is crucial that all team members run the exact same setup to avoid environment or dependency mismatch issues.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher) - *Note: The project uses npm by default, though pnpm configuration is present.*

### 2. Getting Started
Clone the repository and install the dependencies exactly as specified in the `package.json` and `package-lock.json`. 

```bash
# 1. Clone the repository
git clone <repository-url>
cd sirjordan

# 2. Install exact dependencies (clean install is recommended for teams)
npm ci
# Alternatively, if package-lock is not yet committed, use:
# npm install
```

### 3. Running the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📦 Core Dependencies

To help the team understand the tech stack, here are the primary technologies powering this simulator:

- **Framework**: React 18 + Vite 6
- **Styling**: TailwindCSS v4
- **Animations**: Motion (Framer Motion v12)
- **3D Rendering**: Three.js, `@react-three/fiber`, and `@react-three/drei`
- **Icons**: `lucide-react`
- **Charts**: `recharts`

*All dependencies are predefined in `package.json`. Do not install alternative libraries for these core functions without team consensus.*

---

## 📂 Project Structure Overview

- `src/app/components/` - Contains all modular UI elements (LeftPanel, CenterPanel, RightPanel, CityScene).
- `src/app/components/heatUtils.ts` - Core business logic containing the Rothfusz regression equation and DOLE protocols.
- `public/models/` - Contains the 3D `.glb` assets used in the background scene.
- `HEAT_INDEX_THRESHOLDS.md` - Documentation detailing the logic behind the risk thresholds.

---

## 🤝 Contribution Guidelines
When making changes, please ensure:
1. You run `npm run build` locally to verify there are no TypeScript or Vite build errors before pushing.
2. Any updates to heat thresholds or visual mappings must be documented in `HEAT_INDEX_THRESHOLDS.md`.